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

function password(): string | null {
  const p = process.env.ADMIN_PASSWORD;
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
