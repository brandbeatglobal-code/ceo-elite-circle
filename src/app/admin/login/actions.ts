"use server";

import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  adminEnabled,
  checkPassword,
  createSession,
} from "@/lib/admin/auth";

/**
 * Failed-attempt throttle. In-memory and per server instance — on serverless
 * this resets whenever an instance is recycled, which is accepted: this is a
 * lightweight brake on a one-editor admin, not hardened infrastructure. The
 * error shown is the same whatever went wrong, and the delay grows with
 * consecutive failures from the same address.
 */
const failures = new Map<string, { count: number; at: number }>();
const FAILURE_WINDOW_MS = 15 * 60_000;

function prune(now: number) {
  for (const [ip, rec] of failures) {
    if (now - rec.at > FAILURE_WINDOW_MS) failures.delete(ip);
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function login(formData: FormData): Promise<void> {
  if (!adminEnabled()) notFound();

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  const now = Date.now();
  prune(now);

  const rec = failures.get(ip);
  if (rec) await sleep(Math.min(rec.count, 5) * 1000);

  const supplied = String(formData.get("password") ?? "");
  if (checkPassword(supplied)) {
    failures.delete(ip);
    const session = createSession();
    (await cookies()).set(SESSION_COOKIE, session.value, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/admin",
      expires: session.expires,
    });
    redirect("/admin");
  }

  failures.set(ip, { count: Math.min((rec?.count ?? 0) + 1, 10), at: now });
  redirect("/admin/login?error=1");
}

export async function logout(): Promise<void> {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/admin" });
  redirect("/admin/login");
}
