import { contentFile } from "@/lib/admin/registry";
import { sectionTypeSpec } from "@/lib/admin/sectionTypes";
import {
  commitFiles,
  commitsAhead,
  compareUrl,
  createBranch,
  deleteBranch,
  mergeBranch,
  previewUrl,
  readBranch,
  readBranchHead,
  readFile,
  structureBranchName,
} from "@/lib/admin/github";

/**
 * Proposing, reviewing and publishing a structural change.
 *
 * Every other save in this admin is instant: one field, committed to `main`,
 * live in about a minute. That is right for a sentence and wrong for a
 * structure. Moving a section renumbers everything below it and repaints half
 * the page's backgrounds, and the only honest review of that is looking at the
 * page — which means the change has to exist somewhere reviewable *before* it
 * is live.
 *
 * So: a structural change is committed to a branch named after the page, Vercel
 * builds that branch as a preview by itself, and publishing is a merge.
 *
 * **The branch's existence is the pending-state record.** There is no flag
 * anywhere else — no file, no field, no cache. That is deliberate: two records
 * of the same fact can disagree, and this one is checked before every content
 * save, so a stale flag would either block edits that should be allowed or
 * allow edits that should be blocked. Publish and discard cannot leave the
 * tracking out of step with git, because they are the same operation.
 *
 * One branch per page, at a deterministic name, so a second proposal for the
 * same page is a second commit on the branch that is already there rather than
 * a competing one.
 */

export type Pending = {
  page: string;
  branch: string;
  sha: string;
  previewUrl: string;
  compareUrl: string;
  /** What the branch would change, in words. Null if it cannot be read. */
  summary: string | null;
};

export type PendingState =
  | { ok: true; pending: Pending | null }
  | { ok: false; error: string };

export type SectionRef = { id: string; title: string; type: string };

function sectionsOf(raw: string): SectionRef[] | null {
  try {
    const data = JSON.parse(raw) as { sections?: unknown };
    if (!Array.isArray(data.sections)) return null;
    return data.sections.map((s) => {
      const o = (s ?? {}) as Record<string, unknown>;
      return {
        id: typeof o.id === "string" ? o.id : "",
        title: typeof o.title === "string" ? o.title : "",
        type: typeof o.type === "string" ? o.type : "",
      };
    });
  } catch {
    return null;
  }
}

/**
 * How to refer to a section in a sentence.
 *
 * A section that has been given a headline is called by it. A brand-new one has
 * none — by design — so it is called by its layout instead: "a new Feature grid
 * section". Naming it "Untitled" would be accurate and useless; naming the
 * layout tells the reader what is actually about to appear on the page.
 */
function nameOf(s: SectionRef): string {
  if (s.title.trim()) return `“${s.title.trim()}”`;
  const spec = sectionTypeSpec(s.type);
  return spec ? `a new ${spec.label} section` : "a new section";
}

function list(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/**
 * What this change does, in words, for adds and removes as well as moves.
 *
 * The summary is read before anyone clicks through to the preview, so for a
 * removal it has to name what is going — that is the whole point of showing it
 * first. A generic "the page changed" would be worse than nothing, because it
 * reads as reassurance.
 */
export function describeSectionChange(
  before: SectionRef[],
  after: SectionRef[],
): string {
  const beforeIds = before.map((s) => s.id);
  const afterIds = after.map((s) => s.id);
  const added = after.filter((s) => !beforeIds.includes(s.id));
  const removed = before.filter((s) => !afterIds.includes(s.id));

  // Positions among the sections that exist on both sides — so a move is still
  // reported as a move even when something was added or removed alongside it.
  const common = before.filter((s) => afterIds.includes(s.id)).map((s) => s.id);
  const commonAfter = after.filter((s) => beforeIds.includes(s.id)).map((s) => s.id);
  const reordered = common.some((id, i) => commonAfter[i] !== id);

  const parts: string[] = [];
  if (added.length) {
    parts.push(`Added ${list(added.map(nameOf))} at the end of the page`);
  }
  if (removed.length) {
    parts.push(`Removed ${list(removed.map(nameOf))}`);
  }
  if (reordered) {
    // `describeReorder` already writes a whole sentence — "X and Y swapped
    // positions" — so it is used as written. Prefixing it produced "Moved X
    // and Y swapped positions", which is what happens when two sentence
    // builders both think they are the one starting the sentence.
    parts.push(
      describeReorder(
        before.filter((s) => afterIds.includes(s.id)),
        after.filter((s) => beforeIds.includes(s.id)),
      ).replace(/\.$/, ""),
    );
  }
  if (!parts.length) return "No change to this page's sections.";

  const tail =
    added.length || removed.length
      ? ` The page now has ${after.length} section${after.length === 1 ? "" : "s"}, and the numbering and backgrounds after any change have moved with it.`
      : "";
  return `${parts.join(". ")}.${tail}`;
}

/**
 * What changed, as a sentence.
 *
 * This is the whole reason sections carry a permanent id. Compared by
 * position, moving one section past another reads as every position from there
 * down having changed; compared by id, it reads as the two sections that
 * actually moved. The ids are what make the difference between a diff and a
 * description.
 */
export function describeReorder(
  before: { id: string; title: string }[],
  after: { id: string; title: string }[],
): string {
  const beforeIds = before.map((s) => s.id);
  const afterIds = after.map((s) => s.id);

  const added = after.filter((s) => !beforeIds.includes(s.id));
  const removed = before.filter((s) => !afterIds.includes(s.id));
  const parts: string[] = [];

  if (added.length) {
    parts.push(
      `${added.map((s) => `“${s.title}”`).join(" and ")} ${added.length > 1 ? "were" : "was"} added`,
    );
  }
  if (removed.length) {
    parts.push(
      `${removed.map((s) => `“${s.title}”`).join(" and ")} ${removed.length > 1 ? "were" : "was"} removed`,
    );
  }

  if (!added.length && !removed.length) {
    const moved = after.filter((s, i) => beforeIds[i] !== s.id);
    if (!moved.length) return "No change to this page's sections.";
    // The common case, and the one worth naming precisely: exactly two
    // sections trading places.
    if (moved.length === 2) {
      const [a, b] = moved;
      const aWas = beforeIds.indexOf(a.id);
      const bWas = beforeIds.indexOf(b.id);
      if (aWas === afterIds.indexOf(b.id) && bWas === afterIds.indexOf(a.id)) {
        return `“${a.title}” and “${b.title}” swapped positions.`;
      }
    }
    const moves = moved.map((s) => {
      const from = beforeIds.indexOf(s.id) + 1;
      const to = afterIds.indexOf(s.id) + 1;
      return `“${s.title}” moves from ${from} to ${to}`;
    });
    return `${moves.join("; ")}.`;
  }

  const order = after.map((s) => `“${s.title}”`).join(", ");
  return `${parts.join(", and ")}. The page's sections are now: ${order}.`;
}

/** Is there a structural change pending on this page, and what does it say? */
export async function pendingFor(page: string): Promise<PendingState> {
  const cf = contentFile(page);
  if (!cf) return { ok: false, error: "That content file was not found." };

  const branch = structureBranchName(page);
  const state = await readBranch(branch);
  if (!state.ok) return { ok: false, error: state.error };
  if (!state.exists) return { ok: true, pending: null };
  // A branch with nothing `main` has not got is not a pending change — it is
  // usually a publish whose tidy-up failed. Nothing to review, nothing to
  // block, nothing to show.
  const ahead = await commitsAhead(branch);
  if (ahead === 0) return { ok: true, pending: null };

  // Both sides of the comparison read from the repository, never from this
  // deployment's own copy — the same rule every save here follows.
  const [live, proposed] = await Promise.all([
    readFile(`content/${cf.fileName}`),
    readFile(`content/${cf.fileName}`, branch),
  ]);
  const beforeSections = live.ok ? sectionsOf(live.content) : null;
  const afterSections = proposed.ok ? sectionsOf(proposed.content) : null;

  return {
    ok: true,
    pending: {
      page,
      branch,
      sha: state.sha.slice(0, 7),
      previewUrl: previewUrl(branch),
      compareUrl: compareUrl(branch),
      summary:
        beforeSections && afterSections
          ? describeSectionChange(beforeSections, afterSections)
          : null,
    },
  };
}

export type ProposeResult =
  | { ok: true; branch: string; created: boolean; previewUrl: string; summary: string }
  | { ok: false; error: string };

/**
 * Put a proposed version of a content file on the page's structural branch.
 *
 * Creates the branch from the current `main` if it is not there, and commits
 * onto it if it is — so a second move builds on the first rather than starting
 * a rival branch. The caller supplies the whole file, already validated.
 */
export async function proposeStructure(
  page: string,
  json: string,
  message: string,
  summary: string,
): Promise<ProposeResult> {
  const cf = contentFile(page);
  if (!cf) return { ok: false, error: "That content file was not found." };

  const branch = structureBranchName(page);
  const state = await readBranch(branch);
  if (!state.ok) return { ok: false, error: state.error };

  let created = false;
  if (!state.exists) {
    const head = await readBranchHead();
    if (!head.ok) return { ok: false, error: head.error };
    const made = await createBranch(branch, head.sha);
    if (!made.ok) return { ok: false, error: made.error };
    created = true;
  }

  const commit = await commitFiles(
    [{ path: `content/${cf.fileName}`, content: json }],
    [],
    `${message}\n\nProposed through the content admin. ${summary}`,
    undefined,
    branch,
  );
  if (!commit.ok) {
    // A branch created moments ago with nothing on it is worse than no branch:
    // it would block every content save to this page for a change that does
    // not exist. Roll it back rather than leave that behind.
    if (created) await deleteBranch(branch);
    return { ok: false, error: commit.error };
  }

  return { ok: true, branch, created, previewUrl: previewUrl(branch), summary };
}

export type PublishResult =
  | { ok: true; sha: string | null }
  | { ok: false; error: string };

/**
 * Merge the page's structural branch into `main`, then delete it.
 *
 * Deleting after a successful merge is what clears the pending state, and it
 * cannot drift from the merge because the merge is the thing being recorded.
 * If the delete fails the merge still stands — the change is live — so this
 * reports success and says the branch is still there, rather than implying
 * nothing happened.
 */
export async function publishStructure(
  page: string,
  summary: string,
): Promise<PublishResult> {
  const branch = structureBranchName(page);
  const state = await readBranch(branch);
  if (!state.ok) return { ok: false, error: state.error };
  if (!state.exists) {
    return { ok: false, error: "There is no pending change on this page to publish." };
  }

  const merged = await mergeBranch(
    branch,
    `Publish structural change to ${page}\n\n${summary}\n\nPublished through the content admin.`,
  );
  if (!merged.ok) return { ok: false, error: merged.error };

  const removed = await deleteBranch(branch);
  if (!removed.ok) {
    return {
      ok: false,
      error: `Published, but the pending branch could not be cleared (${removed.error}) — the page will still show as having a change pending. Reload; if it persists the branch needs removing by hand.`,
    };
  }
  return { ok: true, sha: merged.sha ? merged.sha.slice(0, 7) : null };
}

export async function discardStructure(
  page: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const branch = structureBranchName(page);
  return deleteBranch(branch);
}
