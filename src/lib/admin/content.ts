import { readBranchHead, readFile } from "@/lib/admin/github";
import { contentFile, type ContentFile } from "@/lib/admin/registry";

/**
 * What "the current content" means to the admin.
 *
 * `registry.ts` reads `content/` from the filesystem, which is right for
 * discovering *what exists* — the section list, the field walk, the shapes.
 * It is wrong for *values*, because on Vercel that directory is a snapshot
 * taken when the deployment was built. A save commits to `main` and the
 * resulting deploy takes about a minute, so for that minute the running
 * server's copy is behind the repository.
 *
 * That gap caused a real data loss: two photo uploads a few seconds apart,
 * the second one read the pre-first-save snapshot, applied its own change to
 * it, and committed the whole file — reverting the first upload, which nobody
 * had touched. The fix is this module. Every edit is based on what the
 * repository holds at a named commit, and every write is conditional on the
 * repository still being at that commit.
 *
 * A save that cannot read the repository does not fall back to the snapshot.
 * Guessing is exactly what caused the bug.
 */

export type EditBase =
  | {
      ok: true;
      /** Identity and labels from disk; `data` is the repository's copy. */
      cf: ContentFile;
      /** Blob sha of the file as read — a compare-and-swap token for the write. */
      sha: string;
      /** The commit the read was pinned to. */
      head: string;
    }
  | { ok: false; error: string };

function parseContent(
  raw: string,
): { ok: true; data: Record<string, unknown> } | { ok: false } {
  try {
    const data = JSON.parse(raw) as unknown;
    if (data === null || typeof data !== "object" || Array.isArray(data)) {
      return { ok: false };
    }
    return { ok: true, data: data as Record<string, unknown> };
  } catch {
    return { ok: false };
  }
}

/**
 * The content an edit must be applied to: the repository's copy, at a pinned
 * commit, or a clear refusal.
 */
export async function editBase(name: string): Promise<EditBase> {
  const cf = contentFile(name);
  if (!cf) return { ok: false, error: "That content file was not found." };

  const head = await readBranchHead();
  if (!head.ok) return { ok: false, error: head.error };

  const fetched = await readFile(`content/${cf.fileName}`, head.sha);
  if (!fetched.ok) return { ok: false, error: fetched.error };

  const parsed = parseContent(fetched.content);
  if (!parsed.ok) {
    return {
      ok: false,
      error:
        "The current content in the repository could not be read as JSON, so this save was not attempted. Nothing has been changed.",
    };
  }

  return {
    ok: true,
    // `data` replaced, so nothing downstream can reach the stale copy by
    // accident. Everything else on `cf` is identity, not content.
    cf: { ...cf, data: parsed.data },
    sha: fetched.sha,
    head: head.sha,
  };
}

export type DisplayContent = {
  cf: ContentFile;
  /**
   * Set only when the values shown are this deployment's own copy rather than
   * the repository's — rendered on the page, because the difference is
   * exactly what a save made in the last minute would look like.
   */
  note: string | null;
};

/**
 * The content to *show* in the panel. Same live read, but a failure falls back
 * to the deployment's copy and says so, rather than leaving the editor with a
 * blank page. Display has no way to lose anyone's work; a save still refuses.
 */
export async function displayContent(name: string): Promise<DisplayContent | null> {
  const cf = contentFile(name);
  if (!cf) return null;

  const fetched = await readFile(`content/${cf.fileName}`);
  if (fetched.ok) {
    const parsed = parseContent(fetched.content);
    if (parsed.ok) return { cf: { ...cf, data: parsed.data }, note: null };
    return {
      cf,
      note: "The copy of this file in the repository could not be read as JSON, so the values below come from this deployment instead.",
    };
  }

  return {
    cf,
    note: "These values come from this deployment's own copy of the file, because the repository could not be read just now — so a change saved in the last minute may not be shown yet. Saving is unaffected: an edit is always applied to the repository's copy, and is refused outright if that cannot be read.",
  };
}
