import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { DraftBanner } from "@/components/DraftBanner";
import { about } from "@/lib/about";
import { home } from "@/lib/home";
import { activeMode, type TextMode } from "@/lib/images";

/**
 * The public site's shell — nav, footer, back-to-top and the draft notice —
 * as one component, because it is needed in two places that cannot share a
 * layout: `(site)/layout.tsx`, and the root `not-found.tsx`. A URL that
 * matches no route never enters the `(site)` segment, so without this the
 * 404 page would render bare, with no way back into the site.
 */

/**
 * The routes that open on a full-bleed photograph, and which copy colour that
 * photograph carries. The bar is transparent over these until it is scrolled
 * past, so it is sitting on the hero's picture and has to read the hero's
 * mode — hardcoded white is how a dark-mode hero would strand white nav links
 * on a pale photograph.
 *
 * Resolved here rather than inside `Nav` on purpose: `Nav` is a client
 * component, and importing the two content files into it would ship both into
 * the browser bundle to answer a two-key question.
 */
const heroTextModes: Record<string, TextMode> = {
  "/": activeMode(home.hero.photo),
  "/about": activeMode(about.hero.photo),
};

export function SiteChrome({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav heroTextModes={heroTextModes} />
      <main>{children}</main>
      <Footer />
      <BackToTop />
      <DraftBanner />
    </>
  );
}
