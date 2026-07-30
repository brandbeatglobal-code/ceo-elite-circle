"use server";

import fs from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { adminEnabled, hasSession } from "@/lib/admin/auth";
import { commitFile, commitFiles, type CommitEntry } from "@/lib/admin/github";
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

  const cf = contentFile(fileName);
  if (!cf) return { status: "error", message: "That content file was not found." };

  const result = validateEdit(cf.name, cf.data, fieldPath, value);
  if (!result.ok) return { status: "error", message: result.error };

  const label = fieldPath
    .split(".")
    .map((p) => (/^\d+$/.test(p) ? `#${Number(p) + 1}` : keyLabel(p).toLowerCase()))
    .join(" › ");

  const commit = await commitFile(
    `content/${cf.fileName}`,
    result.json,
    `Content: update ${cf.fileName} — ${fieldPath}\n\nEdited through the content admin.\nField: ${label}`,
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
    message: `Saved as commit ${commit.sha}. This will appear on the live site in about a minute, once the deploy finishes.`,
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
  const clear = formData.get("clear") === "1";
  const upload = formData.get("image");

  const cf = contentFile(fileName);
  if (!cf) return { status: "error", message: "That content file was not found." };

  const parsed = parsePath(fieldPath);
  const current = parsed ? getAtPath(cf.data, parsed) : undefined;
  if (!parsed || !isPhotoObject(current)) {
    return { status: "error", message: "That is not a photo slot. Reload the page and try again." };
  }

  let nextSrc: string | null;
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
    entries.push({ path: `public${nextSrc}`, content: processed.bytes });
    uploadedNote =
      processed.sourceFormat === "heic"
        ? " The iPhone photo was converted to JPEG."
        : "";
  } else if (clear) {
    nextSrc = null;
  } else {
    nextSrc = current.src;
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
  });
  if (!result.ok) return { status: "error", message: result.error };
  entries.push({ path: `content/${cf.fileName}`, content: result.json });

  const what =
    entries.length > 1 ? "photograph replaced" : clear ? "photograph cleared" : "photo text updated";
  const commit = await commitFiles(
    entries,
    deletions,
    `Content: ${cf.fileName} — ${fieldPath} ${what}\n\nEdited through the content admin.`,
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
