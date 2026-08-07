/**
 * Committing a content file to GitHub.
 *
 * The repository is the database: a save is a real commit on `main`, which
 * triggers the Vercel deploy that has published every change in this project.
 * Every edit therefore has history and can be reverted like any other commit.
 *
 * The token is a fine-grained personal access token scoped to this repository
 * alone, with Contents: read and write and nothing else. It lives only in
 * Vercel's environment variables — never in the repo, and there is no fallback
 * value. Unset, saving fails with a clear message rather than silently doing
 * nothing.
 *
 * `GITHUB_API_BASE` exists so the commit path can be exercised against a local
 * stand-in for the API during verification, without a real token. It defaults
 * to GitHub and should not be set in production.
 */
const API_BASE = process.env.GITHUB_API_BASE ?? "https://api.github.com";
const REPO = process.env.GITHUB_REPO ?? "brandbeatglobal-code/ceo-elite-circle";
const BRANCH = process.env.GITHUB_BRANCH ?? "main";

export type CommitResult =
  | { ok: true; sha: string; commitUrl: string | null }
  | { ok: false; error: string };

export function githubConfigured(): boolean {
  return Boolean(process.env.GITHUB_TOKEN);
}

export function repoLabel(): string {
  return `${REPO}@${BRANCH}`;
}

function headers(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
    "User-Agent": "cec-content-admin",
  };
}

export type FetchedFile =
  | { ok: true; content: string; sha: string }
  | { ok: false; error: string };

export type FetchedHead = { ok: true; sha: string } | { ok: false; error: string };

/**
 * A deployment that is not production may not write to the production branch.
 *
 * The password split in `auth.ts` stops the live panel and a preview panel
 * sharing a way in; this stops them sharing a *destination*. A preview build
 * carries the same `GITHUB_TOKEN`, so without this it would commit to `main`
 * exactly like the real thing — the separate password would be theatre.
 *
 * So: off production, every write is refused unless `GITHUB_BRANCH` names some
 * branch other than `main`. Set it on the preview environment and the panel is
 * fully usable against a sandbox branch — commits, uploads, structural
 * branches and their merges all land there, because every one of those paths
 * is defined in terms of `BRANCH`. Leave it unset and the preview panel reads
 * but cannot write, which is a safe and legible failure rather than a silent
 * write to the live site.
 */
function sandboxViolation(): string | null {
  if (process.env.VERCEL_ENV === "production") return null;
  if (BRANCH !== "main") return null;
  return (
    "This is a preview of the admin, and previews are not allowed to write to the live site. " +
    "It needs GITHUB_BRANCH set to a sandbox branch before anything here can be saved. " +
    "Nothing has been changed."
  );
}

const NO_TOKEN =
  "Saving is not configured yet: this site has no GitHub token set, so there is nowhere to commit the change. Nothing has been altered.";
const REFUSED =
  "GitHub refused the saved credentials. The token may have expired or lost access to this repository. Nothing has been changed.";

/**
 * The commit the branch currently points at.
 *
 * Every edit is pinned to one commit: the content it is based on is read at
 * this sha, and the write is made conditional on the branch still being here.
 * That is what makes two saves inside the deploy window safe — the second one
 * either sees the first one's commit, or is refused.
 */
export async function readBranchHead(): Promise<FetchedHead> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { ok: false, error: NO_TOKEN };
  try {
    const res = await fetch(
      `${API_BASE}/repos/${REPO}/git/ref/${encodeURIComponent(`heads/${BRANCH}`)}`,
      { headers: headers(token), cache: "no-store" },
    );
    if (res.status === 401 || res.status === 403) return { ok: false, error: REFUSED };
    if (res.status !== 200) {
      return {
        ok: false,
        error: `The repository could not be read from GitHub (HTTP ${res.status}), so this save was not attempted. Nothing has been changed.`,
      };
    }
    const body = (await res.json()) as { object?: { sha?: string } };
    const sha = body.object?.sha;
    if (typeof sha !== "string") {
      return {
        ok: false,
        error:
          "GitHub returned the branch in an unexpected form, so this save was not attempted. Nothing has been changed.",
      };
    }
    return { ok: true, sha };
  } catch {
    return {
      ok: false,
      error:
        "GitHub could not be reached to read the current content, so this save was not attempted. Nothing has been changed.",
    };
  }
}

/**
 * Read a file's current contents from the repository — not this server's copy.
 *
 * This exists because the deployed bundle's `content/` is a snapshot taken at
 * build time: it only changes when a deploy finishes, about a minute after a
 * save. An edit built on that snapshot silently reverts anything committed
 * since it was taken. Every write must therefore start from what GitHub holds
 * right now, and a save that cannot read it must fail rather than guess.
 *
 * `ref` pins the read to an exact commit, so the content and the concurrency
 * check cannot be describing two different moments.
 */
export async function readFile(
  repoPath: string,
  ref: string = BRANCH,
): Promise<FetchedFile> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { ok: false, error: NO_TOKEN };
  try {
    const res = await fetch(
      `${API_BASE}/repos/${REPO}/contents/${repoPath}?ref=${encodeURIComponent(ref)}`,
      { headers: headers(token), cache: "no-store" },
    );
    if (res.status === 401 || res.status === 403) return { ok: false, error: REFUSED };
    if (res.status !== 200) {
      return {
        ok: false,
        error: `The current content could not be read from GitHub (HTTP ${res.status}), so this save was not attempted. Nothing has been changed.`,
      };
    }
    const body = (await res.json()) as { content?: string; sha?: string };
    if (typeof body.content !== "string" || typeof body.sha !== "string") {
      return {
        ok: false,
        error:
          "GitHub returned the file in an unexpected form, so this save was not attempted. Nothing has been changed.",
      };
    }
    return {
      ok: true,
      content: Buffer.from(body.content, "base64").toString("utf8"),
      sha: body.sha,
    };
  } catch {
    return {
      ok: false,
      error:
        "GitHub could not be reached to read the current content, so this save was not attempted. Nothing has been changed.",
    };
  }
}

export type CommitEntry = {
  /** Repo-relative path, e.g. `content/about.json`. */
  path: string;
  /** UTF-8 text or binary content. */
  content: Buffer | string;
};

/**
 * Create one commit carrying several file changes — and, optionally, file
 * deletions — atomically, via the Git Data API. The Contents API can only
 * touch one file per commit, and a photo save must never leave a moment
 * where the JSON references an image that is not in the repository yet (or a
 * replaced image lingers after nothing points at it). Blobs, then a tree on
 * top of the branch head, then a commit, then a fast-forward ref update; a
 * non-fast-forward means someone else pushed first, and maps to the same
 * "changed while you were editing" error the single-file path reports.
 *
 * `baseCommitSha` is the commit the edit was read from. Building the tree on
 * that commit — rather than on whatever the branch happens to point at now —
 * is what makes the ref update refuse instead of quietly discarding anything
 * committed since the read.
 */
export async function commitFiles(
  entries: CommitEntry[],
  deletions: string[],
  message: string,
  baseCommitSha?: string,
  /** Which branch to commit on. Defaults to `main`; a structural change
   *  passes its own branch so the change lands there and nowhere else. */
  targetBranch: string = BRANCH,
): Promise<CommitResult> {
  const sandbox = sandboxViolation();
  if (sandbox) return { ok: false, error: sandbox };
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { ok: false, error: NO_TOKEN };
  const h = headers(token);
  const base = `${API_BASE}/repos/${REPO}/git`;

  const call = async (
    method: string,
    url: string,
    body?: unknown,
  ): Promise<{ status: number; json: Record<string, unknown> }> => {
    const res = await fetch(url, {
      method,
      headers: h,
      cache: "no-store",
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    let json: Record<string, unknown> = {};
    try {
      json = (await res.json()) as Record<string, unknown>;
    } catch {
      // Some error responses carry no body; the status is enough.
    }
    return { status: res.status, json };
  };

  try {
    let headSha = baseCommitSha;
    if (!headSha) {
      const ref = await call("GET", `${base}/ref/${encodeURIComponent(`heads/${targetBranch}`)}`);
      if (ref.status === 401 || ref.status === 403) return { ok: false, error: REFUSED };
      if (ref.status !== 200) {
        return { ok: false, error: `GitHub could not be read (HTTP ${ref.status}). Nothing has been changed.` };
      }
      headSha = (ref.json.object as { sha?: string })?.sha;
    }
    if (!headSha) return { ok: false, error: "GitHub returned an unexpected reply. Nothing has been changed." };

    const headCommit = await call("GET", `${base}/commits/${headSha}`);
    const baseTree = (headCommit.json.tree as { sha?: string })?.sha;
    if (headCommit.status !== 200 || !baseTree) {
      return { ok: false, error: "GitHub could not be read. Nothing has been changed." };
    }

    const tree: { path: string; mode: string; type: string; sha: string | null }[] = [];
    for (const entry of entries) {
      const blob = await call("POST", `${base}/blobs`, {
        content: Buffer.isBuffer(entry.content)
          ? entry.content.toString("base64")
          : Buffer.from(entry.content, "utf8").toString("base64"),
        encoding: "base64",
      });
      const blobSha = blob.json.sha as string | undefined;
      if (blob.status !== 201 || !blobSha) {
        return { ok: false, error: "GitHub rejected the file upload. Nothing has been committed." };
      }
      tree.push({ path: entry.path, mode: "100644", type: "blob", sha: blobSha });
    }
    // `sha: null` against a base tree removes the path in the new tree.
    for (const path of deletions) {
      tree.push({ path, mode: "100644", type: "blob", sha: null });
    }

    const newTree = await call("POST", `${base}/trees`, { base_tree: baseTree, tree });
    const treeSha = newTree.json.sha as string | undefined;
    if (newTree.status !== 201 || !treeSha) {
      return { ok: false, error: "GitHub rejected the change. Nothing has been committed." };
    }

    const commit = await call("POST", `${base}/commits`, {
      message,
      tree: treeSha,
      parents: [headSha],
    });
    const commitSha = commit.json.sha as string | undefined;
    if (commit.status !== 201 || !commitSha) {
      return { ok: false, error: "GitHub rejected the change. Nothing has been committed." };
    }

    const updated = await call("PATCH", `${base}/refs/${encodeURIComponent(`heads/${targetBranch}`)}`, {
      sha: commitSha,
    });
    if (updated.status === 409 || updated.status === 422) {
      return {
        ok: false,
        error:
          "The repository changed while you were editing. Reload the page and make the change again.",
      };
    }
    if (updated.status !== 200) {
      return { ok: false, error: `GitHub rejected the change (HTTP ${updated.status}). Nothing has been committed.` };
    }

    return {
      ok: true,
      sha: commitSha.slice(0, 7),
      commitUrl: `https://github.com/${REPO}/commit/${commitSha}`,
    };
  } catch {
    return { ok: false, error: "GitHub could not be reached. Nothing has been committed." };
  }
}

/**
 * Create or update one file on the branch. Reads the current blob SHA first,
 * because the Contents API requires it to replace an existing file — and a
 * mismatch is how GitHub reports that someone else changed the file first.
 */
export async function commitFile(
  repoPath: string,
  contents: string,
  message: string,
  /**
   * The blob sha the edit was based on. Passing it makes the write
   * conditional: if the file changed in the repository since it was read,
   * GitHub refuses rather than overwriting. Omitted, the current sha is
   * looked up instead — which is only safe when nothing was read first.
   */
  knownSha?: string,
): Promise<CommitResult> {
  const sandbox = sandboxViolation();
  if (sandbox) return { ok: false, error: sandbox };
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { ok: false, error: NO_TOKEN };

  const url = `${API_BASE}/repos/${REPO}/contents/${repoPath}`;

  let sha: string | undefined = knownSha;
  try {
    const head = knownSha
      ? null
      : await fetch(
      `${url}?ref=${encodeURIComponent(BRANCH)}`,
      { headers: headers(token), cache: "no-store" },
    );
    if (head === null) {
      // Already known from the read this edit was based on.
    } else if (head.status === 200) {
      const body = (await head.json()) as { sha?: string };
      sha = body.sha;
    } else if (head.status === 401 || head.status === 403) {
      return { ok: false, error: REFUSED };
    } else if (head.status !== 404) {
      return {
        ok: false,
        error: `GitHub could not be read (HTTP ${head.status}). Nothing has been changed.`,
      };
    }
  } catch {
    return {
      ok: false,
      error: "GitHub could not be reached. Nothing has been changed.",
    };
  }

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: headers(token),
      cache: "no-store",
      body: JSON.stringify({
        message,
        content: Buffer.from(contents, "utf8").toString("base64"),
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      }),
    });

    if (res.status === 409 || res.status === 422) {
      return {
        ok: false,
        error:
          "This file changed in the repository while you were editing. Reload the page and make the change again.",
      };
    }
    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        error:
          "GitHub refused the saved credentials. The token may have expired or lost write access. Nothing has been committed.",
      };
    }
    if (res.status !== 200 && res.status !== 201) {
      return {
        ok: false,
        error: `GitHub rejected the change (HTTP ${res.status}). Nothing has been committed.`,
      };
    }

    const body = (await res.json()) as {
      commit?: { sha?: string; html_url?: string };
    };
    return {
      ok: true,
      sha: body.commit?.sha?.slice(0, 7) ?? "unknown",
      commitUrl: body.commit?.html_url ?? null,
    };
  } catch {
    return {
      ok: false,
      error: "GitHub could not be reached. Nothing has been committed.",
    };
  }
}

/* ------------------------------------------------------------------ *
 * Branch operations, for structural changes.
 *
 * Everything above this line writes straight to `main`, because a text or
 * photo edit is small, reviewable in the field itself, and wrong in a way
 * that is obvious the moment the deploy lands. A structural change is not:
 * moving a section changes several numbers and several backgrounds at once,
 * and the only honest review of it is seeing the page.
 *
 * So a structural change goes to a branch of its own, Vercel builds that
 * branch as a preview on its own, and publishing is a merge. There is no
 * separate record of "this page has a change pending" — **the branch's
 * existence is that record.** Nothing to keep in step, nothing to go stale,
 * and no way for the flag and the git state to disagree, because there is
 * only one of them.
 * ------------------------------------------------------------------ */

/**
 * One pending structural branch per page, at a name derived from the page —
 * and, off production, from the branch being written to as well.
 *
 * A preview deployment runs the same code against a sandbox branch, so without
 * the second part it would create and merge `admin/structure/councils`: the
 * exact ref production uses. Two deployments would then share one pending
 * state, a preview's Discard would throw away a real pending change, and a
 * publish would merge a sandbox's work into the live page. Naming the base
 * into the branch keeps them from ever meeting.
 */
export function structureBranchName(page: string): string {
  if (BRANCH === "main") return `admin/structure/${page}`;
  return `admin/structure/${BRANCH.replace(/[^a-zA-Z0-9._-]+/g, "-")}/${page}`;
}

/** Where a save actually lands — `main` in production, a sandbox elsewhere. */
export function targetBranchLabel(): string {
  return BRANCH;
}

/** Is this deployment writing somewhere other than the live branch? */
export function isSandboxTarget(): boolean {
  return BRANCH !== "main";
}

export type BranchState =
  | { ok: true; exists: false }
  | { ok: true; exists: true; sha: string }
  | { ok: false; error: string };

/** Does this page have a structural change pending, and at what commit? */
export async function readBranch(branch: string): Promise<BranchState> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { ok: false, error: NO_TOKEN };
  try {
    const res = await fetch(
      `${API_BASE}/repos/${REPO}/git/ref/${encodeURIComponent(`heads/${branch}`)}`,
      { headers: headers(token), cache: "no-store" },
    );
    if (res.status === 404) return { ok: true, exists: false };
    if (res.status === 401 || res.status === 403) return { ok: false, error: REFUSED };
    if (res.status !== 200) {
      return { ok: false, error: `GitHub could not be read (HTTP ${res.status}).` };
    }
    const body = (await res.json()) as { object?: { sha?: string } };
    const sha = body.object?.sha;
    if (typeof sha !== "string") {
      return { ok: false, error: "GitHub returned the branch in an unexpected form." };
    }
    return { ok: true, exists: true, sha };
  } catch {
    return { ok: false, error: "GitHub could not be reached." };
  }
}

/** Point a new branch at a commit. */
export async function createBranch(
  branch: string,
  sha: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sandbox = sandboxViolation();
  if (sandbox) return { ok: false, error: sandbox };
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { ok: false, error: NO_TOKEN };
  try {
    const res = await fetch(`${API_BASE}/repos/${REPO}/git/refs`, {
      method: "POST",
      headers: headers(token),
      cache: "no-store",
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha }),
    });
    if (res.status === 201) return { ok: true };
    if (res.status === 401 || res.status === 403) return { ok: false, error: REFUSED };
    if (res.status === 422) {
      return { ok: false, error: "That branch already exists. Reload and try again." };
    }
    return { ok: false, error: `GitHub refused to create the branch (HTTP ${res.status}).` };
  } catch {
    return { ok: false, error: "GitHub could not be reached." };
  }
}

export async function deleteBranch(
  branch: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sandbox = sandboxViolation();
  if (sandbox) return { ok: false, error: sandbox };
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { ok: false, error: NO_TOKEN };
  try {
    const res = await fetch(
      `${API_BASE}/repos/${REPO}/git/refs/${encodeURIComponent(`heads/${branch}`)}`,
      { method: "DELETE", headers: headers(token), cache: "no-store" },
    );
    // 204 deleted; 404 already gone, which is the same end state and is what a
    // double-click on Discard produces.
    if (res.status === 204 || res.status === 404) return { ok: true };
    if (res.status === 401 || res.status === 403) return { ok: false, error: REFUSED };
    return { ok: false, error: `GitHub refused to delete the branch (HTTP ${res.status}).` };
  } catch {
    return { ok: false, error: "GitHub could not be reached." };
  }
}

export type MergeResult =
  | { ok: true; sha: string | null }
  | { ok: false; conflict: boolean; error: string };

/**
 * Merge a branch into `main`.
 *
 * The same merge that has published every change in this project, asked for
 * over the API instead of by hand. A 409 is a real conflict — something else
 * changed the same file while the branch was open — and is reported as one
 * rather than resolved automatically, because a line-based merge of a content
 * file is exactly the thing this project has had to undo twice.
 */
export async function mergeBranch(
  branch: string,
  message: string,
): Promise<MergeResult> {
  const sandbox = sandboxViolation();
  if (sandbox) return { ok: false, conflict: false, error: sandbox };
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { ok: false, conflict: false, error: NO_TOKEN };
  try {
    const res = await fetch(`${API_BASE}/repos/${REPO}/merges`, {
      method: "POST",
      headers: headers(token),
      cache: "no-store",
      body: JSON.stringify({ base: BRANCH, head: branch, commit_message: message }),
    });
    if (res.status === 201) {
      const body = (await res.json()) as { sha?: string };
      return { ok: true, sha: body.sha ?? null };
    }
    // Nothing to merge — the branch is already contained in main. That is a
    // success for our purposes: the intended state is live.
    if (res.status === 204) return { ok: true, sha: null };
    if (res.status === 409) {
      return {
        ok: false,
        conflict: true,
        error:
          "This change cannot be published automatically: the page was altered elsewhere while it was pending, and merging the two would have to guess. Discard this change and make it again on the current version.",
      };
    }
    if (res.status === 401 || res.status === 403) {
      return { ok: false, conflict: false, error: REFUSED };
    }
    return {
      ok: false,
      conflict: false,
      error: `GitHub refused the merge (HTTP ${res.status}). Nothing has been published.`,
    };
  } catch {
    return { ok: false, conflict: false, error: "GitHub could not be reached." };
  }
}

/**
 * How far a branch is ahead of `main`.
 *
 * "The branch exists" is not the same question as "something is pending".
 * A branch that has already been merged still exists until it is deleted, and
 * deleting is the one step of publishing that can fail on its own — the merge
 * lands, the delete does not, and the branch is left behind with nothing in it
 * that `main` does not already have. Treating that as pending would lock the
 * page's text for a change that is already live, which is the opposite of what
 * the lock is for.
 *
 * So the question this asks is the honest one: are there commits here that
 * `main` has not got? Nought means nothing is pending, whatever the ref table
 * says.
 *
 * Unreachable is reported as `null` and read by callers as "do not block" —
 * refusing every edit on the site because GitHub blinked is a worse failure
 * than the one being guarded against.
 */
export async function commitsAhead(branch: string): Promise<number | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch(
      `${API_BASE}/repos/${REPO}/compare/${encodeURIComponent(BRANCH)}...${encodeURIComponent(branch)}`,
      { headers: headers(token), cache: "no-store" },
    );
    if (res.status !== 200) return null;
    const body = (await res.json()) as { ahead_by?: number };
    return typeof body.ahead_by === "number" ? body.ahead_by : null;
  } catch {
    return null;
  }
}

/** Read a file from any branch, not just `main`. */
export async function readFileOnBranch(
  repoPath: string,
  branch: string,
): Promise<FetchedFile> {
  return readFile(repoPath, branch);
}

/**
 * Where a reviewer goes to see the change.
 *
 * Vercel builds a preview for every branch automatically, but its hostname is
 * not something this code can compute: the alias is
 * `{project}-git-{branch}-{team}`, which for any branch name worth reading
 * exceeds the 63-character DNS label limit, and Vercel then truncates and
 * appends a hash of its own. Deriving it would need Vercel's API and a second
 * token this project does not have.
 *
 * So the link goes to the deployment list filtered to this branch, which *is*
 * computable and always correct — one click from the preview itself, and it
 * also shows the build still running, which a direct URL would not.
 */
export function previewUrl(branch: string): string {
  const team = "brandbeatglobal-codes-projects";
  const project = "ceo-elite-circle";
  return `https://vercel.com/${team}/${project}/deployments?branch=${encodeURIComponent(branch)}`;
}

/** The branch's own diff against `main`, for anyone who wants the raw change. */
export function compareUrl(branch: string): string {
  return `https://github.com/${REPO}/compare/${BRANCH}...${encodeURIComponent(branch)}`;
}
