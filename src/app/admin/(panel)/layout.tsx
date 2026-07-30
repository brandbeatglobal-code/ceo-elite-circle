import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { ArrowLink, BulletLabel } from "@/components/ui";
import { logout } from "../login/actions";

/**
 * Chrome for the signed-in panel. Every page under it also calls
 * `requireAdmin()` itself — a layout does not re-run when navigating between
 * its own children, so the pages are the gate and this is defence in depth.
 */
export default async function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdmin();

  return (
    <div className="bg-cream text-ink min-h-svh flex flex-col">
      <header className="border-b border-hair">
        <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-5">
          <div className="flex items-baseline gap-4">
            <Link
              href="/admin"
              className="text-lg font-semibold tracking-tight leading-none"
            >
              CEO Elite Circle
            </Link>
            <BulletLabel className="text-olive">Content admin</BulletLabel>
          </div>
          <div className="flex items-center gap-6">
            <ArrowLink href="/">View site</ArrowLink>
            <form action={logout}>
              <button
                type="submit"
                className="type-link text-olive hover:text-sage transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
