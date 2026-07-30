"use server";

import { notFound, redirect } from "next/navigation";
import { adminEnabled, hasSession } from "@/lib/admin/auth";
import { editBase } from "@/lib/admin/content";
import { commitFile } from "@/lib/admin/github";
import { measureBrightness } from "@/lib/admin/images";
import { listContentFiles } from "@/lib/admin/registry";
import { isPhotoObject, validatePhotoEdit } from "@/lib/admin/validate";

/**
 * ONE-TIME MAINTENANCE — delete this route once it has been run.
 *
 * Photographs uploaded through the admin are measured on the way in, so their
 * scrim is sized to the picture. The slots that were filled by hand at design
 * stage — the Unsplash-hosted ones — have no measurement, and an unmeasured
 * slot is treated as a white photograph: full-strength scrim, which is safe
 * but heavier than most of them need.
 *
 * Re-uploading them through the admin would measure them, and would also
 * replace curated licensed photography with duplicates of itself for no
 * reason. This fills in the missing number instead: fetch each image from the
 * URL the content already points at, run the *same* `measureBrightness` the
 * upload path uses, and write the result through the same validated commit
 * path. URLs, files and licensing are untouched.
 *
 * It has to run on production, because that is where the images are
 * reachable — the sandbox blocks `images.unsplash.com`, which is a local
 * testing limitation rather than anything about the live site.
 */

export type BackfillRow = {
  file: string;
  path: string;
  src: string;
  before: number | null;
  after: number | null;
  note: string;
};

export type BackfillState =
  | { status: "idle" }
  | { status: "error"; message: string; rows?: BackfillRow[] }
  | { status: "done"; message: string; rows: BackfillRow[] };

/** Refuse anything that is not an ordinary remote image URL. */
const MAX_FETCH_BYTES = 24 * 1024 * 1024;

async function fetchImage(
  url: string,
): Promise<{ ok: true; bytes: Buffer } | { ok: false; error: string }> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { ok: false, error: "not a URL" };
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { ok: false, error: `unsupported protocol ${parsed.protocol}` };
  }
  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
      headers: { "User-Agent": "cec-content-admin" },
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.length === 0) return { ok: false, error: "empty response" };
    if (bytes.length > MAX_FETCH_BYTES) return { ok: false, error: "too large" };
    return { ok: true, bytes };
  } catch {
    return { ok: false, error: "could not be fetched" };
  }
}

/** Every `{ path, photo }` in a content file, depth-first. */
function photoSlots(
  value: unknown,
  path: string[] = [],
): { path: string[]; photo: { src: string | null; brightness: number | null; alt: string; note: string } }[] {
  if (value === null || typeof value !== "object") return [];
  if (isPhotoObject(value)) return [{ path, photo: value }];
  if (Array.isArray(value)) {
    return value.flatMap((v, i) => photoSlots(v, [...path, String(i)]));
  }
  return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) =>
    photoSlots(v, [...path, k]),
  );
}

export async function backfillBrightness(
  prev: BackfillState,
): Promise<BackfillState> {
  if (!adminEnabled()) notFound();
  if (!(await hasSession())) redirect("/admin/login");

  // A run that stopped part-way already committed some files, and those slots
  // will be skipped this time round because they are no longer unmeasured.
  // Carrying the earlier rows forward keeps them in the record.
  const rows: BackfillRow[] = prev.status === "error" ? [...(prev.rows ?? [])] : [];
  let committed = 0;

  for (const listed of listContentFiles()) {
    const base = await editBase(listed.name);
    if (!base.ok) {
      return { status: "error", message: base.error, rows };
    }

    let data = base.cf.data;
    let json: string | null = null;
    const changed: BackfillRow[] = [];

    for (const slot of photoSlots(data)) {
      const { src, brightness } = slot.photo;
      if (src === null || brightness !== null) continue;
      const dotted = slot.path.join(".");
      if (!/^https?:\/\//.test(src)) {
        rows.push({
          file: listed.fileName, path: dotted, src, before: null, after: null,
          note: "skipped — not a remote URL, so there is nothing to fetch",
        });
        continue;
      }

      const fetched = await fetchImage(src);
      if (!fetched.ok) {
        rows.push({
          file: listed.fileName, path: dotted, src, before: null, after: null,
          note: `skipped — ${fetched.error}`,
        });
        continue;
      }

      let measured: number;
      try {
        measured = await measureBrightness(fetched.bytes);
      } catch {
        rows.push({
          file: listed.fileName, path: dotted, src, before: null, after: null,
          note: "skipped — the image would not decode",
        });
        continue;
      }

      // The same validator every photo save goes through: the path must
      // resolve to a real slot, and the file's shape after the write must be
      // identical everywhere else.
      const result = validatePhotoEdit(data, dotted, {
        src: slot.photo.src,
        alt: slot.photo.alt,
        note: slot.photo.note,
        brightness: measured,
      });
      if (!result.ok) {
        rows.push({
          file: listed.fileName, path: dotted, src, before: null, after: null,
          note: `skipped — ${result.error}`,
        });
        continue;
      }
      json = result.json;
      data = JSON.parse(result.json) as Record<string, unknown>;
      changed.push({
        file: listed.fileName, path: dotted, src, before: null,
        after: measured, note: "measured",
      });
    }

    if (json !== null && changed.length > 0) {
      const commit = await commitFile(
        `content/${listed.fileName}`,
        json,
        `Content: measure brightness for ${changed.length} photograph${changed.length === 1 ? "" : "s"} in ${listed.fileName}\n\nOne-time backfill. The images, their URLs and their licensing are unchanged;\nonly the missing brightness measurement is filled in, so each scrim can be\nsized to its photograph instead of to the worst case.`,
        base.sha,
      );
      if (!commit.ok) {
        return { status: "error", message: `${listed.fileName}: ${commit.error}`, rows };
      }
      committed += 1;
      for (const row of changed) row.note = `measured — commit ${commit.sha}`;
    }
    rows.push(...changed);
  }

  const measured = rows.filter((r) => r.after !== null).length;
  if (measured === 0) {
    return {
      status: "done",
      message: "Nothing to do — every photograph already carries a measurement.",
      rows,
    };
  }
  return {
    status: "done",
    message: `Measured ${measured} photograph${measured === 1 ? "" : "s"} across ${committed} file${committed === 1 ? "" : "s"}. The site picks these up on the next deploy, about a minute.`,
    rows,
  };
}
