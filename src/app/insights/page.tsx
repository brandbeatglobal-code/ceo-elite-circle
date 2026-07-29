import { PageHero } from "@/components/PageHero";
import { RequestSection } from "@/components/RequestSection";
import {
  BulletLabel,
  PhotoFrame,
  Placeholder,
  SectionHeader,
} from "@/components/ui";
import { published } from "@/lib/insights";
import { ordinal } from "@/lib/ordinal";

export const metadata = { title: "Insights — CEO Elite Circle" };

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Knowledge & Insights"
        title="Insights"
        intro="Writing from the Circle. No articles have been published yet — the cards below are structure, not posts."
      />

      <section className="bg-cream text-ink">
        <div className="wrap">
          <SectionHeader index={ordinal(0)} eyebrow="Articles" />

          <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair">
            <h2 className="type-h2 lg:col-span-2 py-12 lg:py-16 lg:pr-10">
              Latest writing
            </h2>
            <div className="lg:col-span-2 lg:border-l border-hair lg:pl-8 pb-12 lg:py-16">
              <Placeholder lead />
            </div>
          </div>

          {/* No real articles exist yet, so nothing is linked. These are
              labelled pending cards, not posts. */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <article
                key={i}
                className={`flex flex-col gap-5 py-10 md:px-8 first:md:pl-0 ${
                  i > 0 ? "md:border-l border-hair" : ""
                } border-t md:border-t-0 border-hair`}
              >
                <BulletLabel className="text-olive">Article pending</BulletLabel>
                <PhotoFrame
                  photo={{
                    src: null,
                    alt: "",
                    note: "the article's lead image.",
                  }}
                  className="h-56"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <Placeholder lead />
                <Placeholder />
              </article>
            ))}
          </div>

          {published.length === 0 && (
            <p className="type-label italic text-olive py-10 max-w-xl">
              The article template exists and is ready to receive a first post.
              It stays unlinked until one is written.
            </p>
          )}
        </div>
      </section>

      <RequestSection index={ordinal(1)} />
    </>
  );
}
