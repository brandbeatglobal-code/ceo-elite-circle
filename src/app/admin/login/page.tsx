import { notFound, redirect } from "next/navigation";
import { adminEnabled, hasSession } from "@/lib/admin/auth";
import { BulletLabel } from "@/components/ui";
import { login } from "./actions";

export const dynamic = "force-dynamic";

/**
 * The one admin route that renders without a session — and only once
 * ADMIN_PASSWORD is configured. Unconfigured, it is the site's 404 like
 * every other admin path.
 */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!adminEnabled()) notFound();
  if (await hasSession()) redirect("/admin");
  const failed = (await searchParams).error !== undefined;

  return (
    <div className="bg-ramp-low text-white min-h-svh flex flex-col justify-center">
      <div className="wrap py-16">
        <div className="max-w-sm mx-auto flex flex-col gap-8">
          <div>
            <BulletLabel className="text-white/60">
              CEO Elite Circle
            </BulletLabel>
            <h1 className="type-display type-h3 mt-4">Content admin</h1>
            <p className="type-body text-white/70 mt-3 max-w-xs">
              Sign in to review the site&rsquo;s content. Access is for the
              Circle&rsquo;s site editors.
            </p>
          </div>

          <form action={login} className="flex flex-col gap-6">
            <label className="flex flex-col gap-2">
              <span className="type-label text-white/70">Password</span>
              <input
                type="password"
                name="password"
                className="field"
                autoComplete="current-password"
                autoFocus
                required
              />
            </label>

            {failed && (
              <p className="type-label text-white/70 italic" role="alert">
                That password was not accepted.
              </p>
            )}

            <button
              type="submit"
              className="pill type-link bg-white text-ink px-8 py-4 inline-flex items-center justify-center gap-2 hover:bg-mint transition-colors"
            >
              <span aria-hidden="true">•</span>
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
