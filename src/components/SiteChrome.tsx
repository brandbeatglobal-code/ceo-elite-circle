import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { DraftBanner } from "@/components/DraftBanner";

/**
 * The public site's shell — nav, footer, back-to-top and the draft notice —
 * as one component, because it is needed in two places that cannot share a
 * layout: `(site)/layout.tsx`, and the root `not-found.tsx`. A URL that
 * matches no route never enters the `(site)` segment, so without this the
 * 404 page would render bare, with no way back into the site.
 */
export function SiteChrome({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
      <BackToTop />
      <DraftBanner />
    </>
  );
}
