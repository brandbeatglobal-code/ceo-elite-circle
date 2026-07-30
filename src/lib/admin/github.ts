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
): Promise<CommitResult> {
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
      const ref = await call("GET", `${base}/ref/${encodeURIComponent(`heads/${BRANCH}`)}`);
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

    const updated = await call("PATCH", `${base}/refs/${encodeURIComponent(`heads/${BRANCH}`)}`, {
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
