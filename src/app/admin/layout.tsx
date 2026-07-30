import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content admin — CEO Elite Circle",
  robots: { index: false, follow: false },
};

/**
 * Shared by the login page and the panel: metadata only. The panel's chrome
 * lives in `(panel)/layout.tsx`, so the login page stays bare.
 */
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
