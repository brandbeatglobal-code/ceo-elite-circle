"use server";

import fs from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { adminEnabled, hasSession } from "@/lib/admin/auth";
import { commitFile } from "@/lib/admin/github";
import { contentFile, keyLabel } from "@/lib/admin/registry";
import { validateEdit } from "@/lib/admin/validate";

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
