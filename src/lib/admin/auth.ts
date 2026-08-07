import crypto from "node:crypto";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

/**
 * Admin access control.
 *
 * One shared password, held only in the ADMIN_PASSWORD environment variable —
 * set directly in Vercel's dashboard, never in the repo. While it is unset,
 * every admin route (login included) serves the site's 404: the safe default
 * is no path in at all, not a login form that always fails.
 *
 * There is deliberately no fallback and no default password.
 *
 * Sessions are a signed, httpOnly, secure cookie carrying its own expiry —
 * `<expiresMs>.<hmac>` — verified server-side on every request. No session
 * store: the signature is the state. The signing key is derived from the
 * password, so changing the password also signs everyone out.
 */
export const SESSION_COOKIE = "cec_admin_session";
const SESSION_HOURS = 24;

/**
 * Is this the deployment the public visits?
 *
 * Vercel sets `VERCEL_ENV` to `production`, `preview` or `development`. Absent
 * — running locally with `next start` — this reads as *not* production, which
 * is the safe direction: it means a local run can use the sandbox password and
 * can never be mistaken for the live site.
 */
export function isProduction(): boolean {
  return process.env.VERCEL_ENV === "production";
}

/**
 * The password this deployment accepts, and there is only ever one.
 *
 * Production takes `ADMIN_PASSWORD` and nothing else. Every other deployment —
 * a branch preview, a local build — takes `ADMIN_PREVIEW_PASSWORD` and nothing
 * else. They do not overlap in either direction, on purpose:
 *
 * - The real password is never typed into a preview URL. Preview hostnames are
 *   guessable, long-lived and shared around; a password entered on one is a
 *   password that has been somewhere it was never meant to go.
 * - The sandbox password cannot open the live panel, even if someone sets the
 *   variable on production by mistake. `isProduction()` decides which name is
 *   read, so the other one is not consulted at all.
 *
 * Both are unset by default, and an unset password means the whole admin is
 * the site's 404 — so a preview with no sandbox password configured simply has
 * no admin, which is the right default for a throwaway build.
 */
function password(): string | null {
  const p = isProduction()
    ? process.env.ADMIN_PASSWORD
    : process.env.ADMIN_PREVIEW_PASSWORD;
  return p && p.length > 0 ? p : null;
}

export function adminEnabled(): boolean {
  return password() !== null;
}

function sign(expires: number, secret: string): string {
  const key = crypto
    .createHmac("sha256", secret)
    .update("cec-admin-session-v1")
    .digest();
  return crypto.createHmac("sha256", key).update(String(expires)).digest("hex");
}

export function checkPassword(supplied: string): boolean {
  const p = password();
  // Cap the input before hashing; nothing legitimate is this long.
  if (!p || supplied.length === 0 || supplied.length > 256) return false;
  const a = crypto.createHash("sha256").update(supplied).digest();
  const b = crypto.createHash("sha256").update(p).digest();
  return crypto.timingSafeEqual(a, b);
}

export function createSession(): { value: string; expires: Date } {
  const p = password();
  if (!p) notFound();
  const expires = Date.now() + SESSION_HOURS * 3_600_000;
  return { value: `${expires}.${sign(expires, p)}`, expires: new Date(expires) };
}

export function verifySessionValue(value: string | undefined): boolean {
  const p = password();
  if (!p || !value) return false;
  const dot = value.indexOf(".");
  if (dot === -1) return false;
  const expStr = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  if (!/^\d{1,16}$/.test(expStr) || !/^[0-9a-f]{64}$/.test(sig)) return false;
  const expires = Number(expStr);
  if (expires <= Date.now()) return false;
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(sign(expires, p), "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function hasSession(): Promise<boolean> {
  const store = await cookies();
  return verifySessionValue(store.get(SESSION_COOKIE)?.value);
}

/**
 * Gate for every admin page. Unconfigured → the site's 404, exactly like any
 * dead URL. Configured but not signed in → the login page.
 */
export async function requireAdmin(): Promise<void> {
  if (!adminEnabled()) notFound();
  if (!(await hasSession())) redirect("/admin/login");
}
