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

/**
 * Create or update one file on the branch. Reads the current blob SHA first,
 * because the Contents API requires it to replace an existing file — and a
 * mismatch is how GitHub reports that someone else changed the file first.
 */
export async function commitFile(
  repoPath: string,
  contents: string,
  message: string,
): Promise<CommitResult> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return {
      ok: false,
      error:
        "Saving is not configured yet: this site has no GitHub token set, so there is nowhere to commit the change. Nothing has been altered.",
    };
  }

  const url = `${API_BASE}/repos/${REPO}/contents/${repoPath}`;

  let sha: string | undefined;
  try {
    const head = await fetch(
      `${url}?ref=${encodeURIComponent(BRANCH)}`,
      { headers: headers(token), cache: "no-store" },
    );
    if (head.status === 200) {
      const body = (await head.json()) as { sha?: string };
      sha = body.sha;
    } else if (head.status === 401 || head.status === 403) {
      return {
        ok: false,
        error:
          "GitHub refused the saved credentials. The token may have expired or lost access to this repository. Nothing has been changed.",
      };
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
