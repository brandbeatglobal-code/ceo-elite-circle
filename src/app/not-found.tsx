import { PageHero } from "@/components/PageHero";
import { SiteChrome } from "@/components/SiteChrome";
import { ArrowLink } from "@/components/ui";

export const metadata = { title: "Page not found — CEO Elite Circle" };

/**
 * Carries the full site chrome itself: a URL that matches no route never
 * enters the `(site)` segment, so this page cannot inherit the shell from
 * that layout. `notFound()` thrown anywhere — an unknown pillar slug, the
 * admin when it is not configured — lands here too.
 */
export default function NotFound() {
  return (
    <SiteChrome>
      <PageHero
        eyebrow="Not found"
        title="This page does not exist"
        intro="The address may have changed as the site takes shape. Everything current is reachable from the navigation."
      />
      <section className="bg-cream text-ink">
        <div className="wrap py-16 lg:py-24">
          <ArrowLink href="/">Return to the start</ArrowLink>
        </div>
      </section>
    </SiteChrome>
  );
}
