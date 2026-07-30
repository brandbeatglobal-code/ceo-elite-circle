import { SiteChrome } from "@/components/SiteChrome";

/**
 * The public site's chrome lives here rather than in the root layout so that
 * `/admin` (which shares the root layout's fonts, globals and motion flag)
 * does not render the marketing shell around an editing surface.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SiteChrome>{children}</SiteChrome>;
}
