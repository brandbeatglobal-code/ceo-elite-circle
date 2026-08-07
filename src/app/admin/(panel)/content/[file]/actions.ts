"use server";

import fs from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { adminEnabled, hasSession } from "@/lib/admin/auth";
import { editBase } from "@/lib/admin/content";
import {
  commitFile,
  commitFiles,
  isSandboxTarget,
  targetBranchLabel,
  readBranch,
  readFile,
  structureBranchName,
  type CommitEntry,
} from "@/lib/admin/github";
import {
  discardStructure,
  pendingFor,
  proposeStructure,
  publishStructure,
} from "@/lib/admin/structure";
import { validateAdd, validateRemove, validateReorder } from "@/lib/admin/reorder";
import {
  MAX_UPLOAD_BYTES,
  isOwnUpload,
  processUpload,
  uploadPath,
} from "@/lib/admin/images";
import { contentFile, keyLabel } from "@/lib/admin/registry";
import { getAtPath, isPhotoObject, parsePath, validatePhotoEdit, validateEdit } from "@/lib/admin/validate";

export type SaveState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "saved"; message: string };

/**
 * Save one field.
 *
 * The edit is applied to the repository's copy of the file, read at the moment
 * of saving — never to this server's copy, which on Vercel is a build-time
 * snapshot and is a minute stale after any save. See `content.ts`.
 *
 * Order matters: validate everything first, then commit to GitHub, and only
 * write to the local file once the commit succeeded. GitHub is the source of
 * truth, so local state must never run ahead of it. On Vercel the filesystem
 * is read-only anyway and that write simply cannot happen — the deploy the
 * commit triggers is what brings the new content.
 *
 * A server action is its own endpoint: the panel layout does not protect it,
 * so it re-checks access itself.
 */
export async function saveField(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  if (!adminEnabled()) notFound();
  if (!(await hasSession())) redirect("/admin/login");

  const fileName = String(formData.get("file") ?? "");
  const fieldPath = String(formData.get("path") ?? "");
  const value = String(formData.get("value") ?? "");

  const base = await editBase(fileName);
  if (!base.ok) return { status: "error", message: base.error };
  const { cf } = base;

  const result = validateEdit(cf.name, cf.data, fieldPath, value);
  if (!result.ok) return { status: "error", message: result.error };

  const label = fieldPath
    .split(".")
    .map((p) => (/^\d+$/.test(p) ? `#${Number(p) + 1}` : keyLabel(p).toLowerCase()))
    .join(" › ");

  // The blob sha makes the write a compare-and-swap: if the file moved on
  // between the read above and this line, GitHub refuses rather than
  // overwriting whatever landed in between.
  const commit = await commitFile(
    `content/${cf.fileName}`,
    result.json,
    `Content: update ${cf.fileName} — ${fieldPath}\n\nEdited through the content admin.\nField: ${label}`,
    base.sha,
  );
  if (!commit.ok) return { status: "error", message: commit.error };

  // Best-effort local write. Expected to fail on Vercel's read-only
  // filesystem, which is not an error: the commit is the save.
  let wroteLocally = false;
  try {
    fs.writeFileSync(
      path.join(process.cwd(), "content", cf.fileName),
      result.json,
      "utf8",
    );
    wroteLocally = true;
  } catch {
    // Read-only filesystem in production.
  }

  if (wroteLocally) {
    revalidatePath(`/admin/content/${cf.name}`);
    revalidatePath("/admin");
  }

  return {
    status: "saved",
    message: isSandboxTarget()
      ? `Saved as commit ${commit.sha} on ${targetBranchLabel()}. This is a preview of the admin — the change is on that branch and not on the live site.`
      : `Saved as commit ${commit.sha}. This will appear on the live site in about a minute, once the deploy finishes.`,
  };
}

/**
 * Save one photo slot — image, alt text and note together, as one unit.
 *
 * Three modes, decided here and never by the form alone:
 * - a new file arrives → process it (magic bytes, limits, HEIC conversion,
 *   re-encode) and point the slot at the stored copy;
 * - no file, `clear` set → the slot returns to its labelled pending frame;
 * - no file, no clear → only the alt and note change, the image stays.
 *
 * The image file and the JSON that references it go to GitHub in a single
 * commit, and a replaced upload is deleted in that same commit — there is
 * never a moment where the content points at a file the repository does not
 * hold, or a superseded upload lingers with nothing pointing at it. Only
 * files this system itself stored are ever deleted; the Unsplash-hosted
 * slots have nothing local to clean up.
 *
 * As with a text save, the JSON written is the repository's copy plus this
 * one slot — not this server's build-time snapshot plus this one slot. The
 * commit is built on the exact commit that copy was read from, so a branch
 * that moved in between is refused rather than rolled back.
 */
export async function savePhoto(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  if (!adminEnabled()) notFound();
  if (!(await hasSession())) redirect("/admin/login");

  const fileName = String(formData.get("file") ?? "");
  const fieldPath = String(formData.get("path") ?? "");
  const alt = String(formData.get("alt") ?? "");
  const note = String(formData.get("note") ?? "");
  const textMode = String(formData.get("textMode") ?? "light");
  const clear = formData.get("clear") === "1";
  const upload = formData.get("image");

  const base = await editBase(fileName);
  if (!base.ok) return { status: "error", message: base.error };
  const { cf } = base;

  const parsed = parsePath(fieldPath);
  const current = parsed ? getAtPath(cf.data, parsed) : undefined;
  if (!parsed || !isPhotoObject(current)) {
    return { status: "error", message: "That is not a photo slot. Reload the page and try again." };
  }

  let nextSrc: string | null;
  // Measured from the stored bytes, never submitted by the form. It sizes the
  // scrim over this slot, so it has to describe the file the site will serve.
  let nextBrightness: number | null;
  const entries: CommitEntry[] = [];
  const deletions: string[] = [];
  let uploadedNote = "";

  if (upload instanceof File && upload.size > 0) {
    if (upload.size > MAX_UPLOAD_BYTES) {
      return {
        status: "error",
        message: `That file is too large — the limit is ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB.`,
      };
    }
    // The uploaded filename is never used for anything — the stored name is
    // generated below from the slot and the processed bytes.
    const processed = await processUpload(Buffer.from(await upload.arrayBuffer()));
    if (!processed.ok) return { status: "error", message: processed.error };

    nextSrc = uploadPath(cf.name, parsed, processed);
    nextBrightness = processed.brightness;
    entries.push({ path: `public${nextSrc}`, content: processed.bytes });
    uploadedNote =
      processed.sourceFormat === "heic"
        ? " The iPhone photo was converted to JPEG."
        : "";
  } else if (clear) {
    nextSrc = null;
    nextBrightness = null;
  } else {
    nextSrc = current.src;
    nextBrightness = current.brightness;
  }

  // Replacing or clearing an upload of our own removes the old file in the
  // same commit. Never anything else — the pattern check is the guard.
  if (current.src !== nextSrc && isOwnUpload(current.src)) {
    deletions.push(`public${current.src}`);
  }

  const result = validatePhotoEdit(cf.data, fieldPath, {
    src: nextSrc,
    alt: nextSrc === null ? "" : alt,
    note,
    brightness: nextBrightness,
    textMode,
  });
  if (!result.ok) return { status: "error", message: result.error };
  entries.push({ path: `content/${cf.fileName}`, content: result.json });

  const what =
    entries.length > 1
      ? "photograph replaced"
      : clear
        ? "photograph cleared"
        : current.textMode !== result.photo.textMode
          ? "text colour changed"
          : "photo text updated";
  const commit = await commitFiles(
    entries,
    deletions,
    `Content: ${cf.fileName} — ${fieldPath} ${what}\n\nEdited through the content admin.`,
    base.head,
  );
  if (!commit.ok) return { status: "error", message: commit.error };

  // Best-effort local mirror, after the commit — read-only on Vercel, where
  // the deploy is what delivers both files.
  let wroteLocally = false;
  try {
    fs.writeFileSync(path.join(process.cwd(), "content", cf.fileName), result.json, "utf8");
    // Joins stay statically scoped to public/ so the file tracer does not
    // conclude the whole project is reachable from here.
    const publicDir = path.join(process.cwd(), "public");
    for (const entry of entries) {
      if (entry.path.startsWith("public/")) {
        const p = path.join(publicDir, entry.path.slice("public/".length));
        fs.mkdirSync(path.dirname(p), { recursive: true });
        fs.writeFileSync(p, entry.content);
      }
    }
    for (const del of deletions) {
      fs.rmSync(path.join(publicDir, del.slice("public/".length)), { force: true });
    }
    wroteLocally = true;
  } catch {
    // Read-only filesystem in production.
  }
  if (wroteLocally) {
    revalidatePath(`/admin/content/${cf.name}`);
    revalidatePath("/admin");
  }

  return {
    status: "saved",
    message: `Saved as commit ${commit.sha}.${uploadedNote} This will appear on the live site in about a minute, once the deploy finishes.`,
  };
}

/* ------------------------------------------------------------------ *
 * Structural changes: propose, publish, discard.
 *
 * These do not write to `main`. A move goes onto the page's own structural
 * branch, Vercel previews that branch, and publishing is the merge. See
 * `src/lib/admin/structure.ts` for why the branch itself is the record of
 * "this page has something pending".
 * ------------------------------------------------------------------ */

export type StructureState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "done"; message: string };

/** Move one section up or down, on the page's structural branch. */
export async function moveSection(
  _prev: StructureState,
  formData: FormData,
): Promise<StructureState> {
  if (!adminEnabled()) notFound();
  if (!(await hasSession())) redirect("/admin/login");

  const fileName = String(formData.get("file") ?? "");
  const id = String(formData.get("id") ?? "");
  const dir = String(formData.get("direction") ?? "");
  if (dir !== "up" && dir !== "down") {
    return { status: "error", message: "That is not a direction." };
  }

  const cf = contentFile(fileName);
  if (!cf) return { status: "error", message: "That page was not found." };

  // The move is applied to whatever the *branch* holds if there is one, and to
  // `main` otherwise — so a second move builds on the first instead of
  // silently discarding it.
  const branch = structureBranchName(cf.name);
  const branchState = await readBranch(branch);
  if (!branchState.ok) return { status: "error", message: branchState.error };
  const source = await readFile(
    `content/${cf.fileName}`,
    branchState.exists ? branch : undefined,
  );
  if (!source.ok) return { status: "error", message: source.error };

  const result = validateReorder(source.content, id, dir);
  if (!result.ok) return { status: "error", message: result.error };

  const proposed = await proposeStructure(
    cf.name,
    result.json,
    `Structure: ${cf.fileName} — move a section ${dir}`,
    result.summary,
  );
  if (!proposed.ok) return { status: "error", message: proposed.error };

  revalidatePath(`/admin/content/${cf.name}`);
  return {
    status: "done",
    message: `${result.summary} Review the preview before publishing — the build takes about a minute.`,
  };
}

export async function publishSections(
  _prev: StructureState,
  formData: FormData,
): Promise<StructureState> {
  if (!adminEnabled()) notFound();
  if (!(await hasSession())) redirect("/admin/login");

  const cf = contentFile(String(formData.get("file") ?? ""));
  if (!cf) return { status: "error", message: "That page was not found." };

  const state = await pendingFor(cf.name);
  if (!state.ok) return { status: "error", message: state.error };
  if (!state.pending) {
    return { status: "error", message: "There is nothing pending on this page." };
  }

  const published = await publishStructure(cf.name, state.pending.summary ?? "");
  if (!published.ok) return { status: "error", message: published.error };

  revalidatePath(`/admin/content/${cf.name}`);
  revalidatePath("/admin");
  return {
    status: "done",
    message: published.sha
      ? `Published as commit ${published.sha}. It will be on the live site in about a minute.`
      : "Published — the live site already had this change.",
  };
}

export async function discardSections(
  _prev: StructureState,
  formData: FormData,
): Promise<StructureState> {
  if (!adminEnabled()) notFound();
  if (!(await hasSession())) redirect("/admin/login");

  const cf = contentFile(String(formData.get("file") ?? ""));
  if (!cf) return { status: "error", message: "That page was not found." };

  const discarded = await discardStructure(cf.name);
  if (!discarded.ok) return { status: "error", message: discarded.error };

  revalidatePath(`/admin/content/${cf.name}`);
  revalidatePath("/admin");
  return {
    status: "done",
    message:
      "Discarded. The live page is unchanged and this page can be edited again.",
  };
}


/**
 * One structural mutation, proposed onto the page's branch.
 *
 * Add, remove and move all come through here. They differ only in the function
 * that produces the next version of the file — everything after that is
 * identical, because the review step is the point and none of the three gets to
 * skip it. Adding a section looks harmless (it starts empty) but it renumbers
 * and re-tones everything after it, which is exactly the kind of change nobody
 * can check without looking at the page.
 */
async function proposeMutation(
  fileName: string,
  apply: (raw: string) => { ok: true; json: string; summary: string } | { ok: false; error: string },
  label: string,
): Promise<StructureState> {
  if (!adminEnabled()) notFound();
  if (!(await hasSession())) redirect("/admin/login");

  const cf = contentFile(fileName);
  if (!cf) return { status: "error", message: "That page was not found." };

  // Applied to the branch if there is one, so a second change builds on the
  // first rather than silently discarding it.
  const branch = structureBranchName(cf.name);
  const state = await readBranch(branch);
  if (!state.ok) return { status: "error", message: state.error };
  const source = await readFile(
    `content/${cf.fileName}`,
    state.exists ? branch : undefined,
  );
  if (!source.ok) return { status: "error", message: source.error };

  const result = apply(source.content);
  if (!result.ok) return { status: "error", message: result.error };

  const proposed = await proposeStructure(
    cf.name,
    result.json,
    `Structure: ${cf.fileName} — ${label}`,
    result.summary,
  );
  if (!proposed.ok) return { status: "error", message: proposed.error };

  revalidatePath(`/admin/content/${cf.name}`);
  return {
    status: "done",
    message: `${result.summary} Review the preview before publishing — the build takes about a minute.`,
  };
}

export async function addSection(
  _prev: StructureState,
  formData: FormData,
): Promise<StructureState> {
  const type = String(formData.get("sectionType") ?? "");
  return proposeMutation(
    String(formData.get("file") ?? ""),
    (raw) => validateAdd(raw, type),
    "add a section",
  );
}

export async function removeSection(
  _prev: StructureState,
  formData: FormData,
): Promise<StructureState> {
  const id = String(formData.get("id") ?? "");
  return proposeMutation(
    String(formData.get("file") ?? ""),
    (raw) => validateRemove(raw, id),
    "remove a section",
  );
}
