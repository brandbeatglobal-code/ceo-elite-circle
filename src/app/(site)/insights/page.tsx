import { PageHero } from "@/components/PageHero";
import { RequestSection } from "@/components/RequestSection";
import {
  ArrowLink,
  BulletLabel,
  PhotoFrame,
  Placeholder,
  SectionHeader,
} from "@/components/ui";
import { insights, published } from "@/lib/insights";
import { ordinal } from "@/lib/ordinal";

const { page } = insights;

export const metadata = { title: page.metaTitle };

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        intro={page.heroIntro}
      />

      <section className="bg-cream text-ink">
        <div className="wrap">
          <SectionHeader index={ordinal(0)} eyebrow={page.listEyebrow} />

          <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair">
            <h2 className="type-h2 lg:col-span-2 py-12 lg:py-24 lg:pr-10">
              {page.listTitle}
            </h2>
            <div className="lg:col-span-2 lg:border-l border-hair lg:pl-8 pb-12 lg:py-24">
              <p className="type-lead text-ink max-w-lg">{page.listIntro}</p>
            </div>
          </div>

          {/* One card per published article. While nothing is published these
              are labelled pending cards instead — present and on-system, but
              not pretending to be posts. */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            {published.length > 0
              ? published.map((article, i) => (
                  <article
                    key={article.slug}
                    className={`flex flex-col gap-6 py-10 lg:py-14 md:px-8 first:md:pl-0 ${
                      i > 0 ? "md:border-l border-hair" : ""
                    } border-t md:border-t-0 border-hair`}
                    data-reveal
                    style={{ transitionDelay: `${i * 70}ms` }}
                  >
                    <BulletLabel className="text-olive">
                      {article.date ?? page.listEyebrow}
                    </BulletLabel>
                    <PhotoFrame
                      photo={article.photo}
                      className="h-56"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <h3 className="type-lead text-ink">{article.title}</h3>
                    <ArrowLink href={`/insights/${article.slug}`}>
                      {page.cardLinkLabel}
                    </ArrowLink>
                  </article>
                ))
              : [0, 1, 2].map((i) => (
                  <article
                    key={i}
                    className={`flex flex-col gap-6 py-10 lg:py-14 md:px-8 first:md:pl-0 ${
                      i > 0 ? "md:border-l border-hair" : ""
                    } border-t md:border-t-0 border-hair`}
                  >
                    <BulletLabel className="text-olive">
                      {page.pendingCardLabel}
                    </BulletLabel>
                    <PhotoFrame
                      photo={{
                        src: null,
                        alt: "",
                        note: page.pendingCardPhotoNote,
                        brightness: null,
                        textMode: "light",
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
            <p className="type-label italic text-olive py-14 max-w-xl">
              {page.emptyNote}
            </p>
          )}
        </div>
      </section>

      <RequestSection index={ordinal(1)} variant="briefings" />
    </>
  );
}
