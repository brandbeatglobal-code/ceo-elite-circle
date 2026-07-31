import { notFound } from "next/navigation";
import { Carousel } from "@/components/Carousel";
import { RequestSection } from "@/components/RequestSection";
import {
  BulletLabel,
  PhotoFrame,
  Placeholder,
  SectionHeader,
} from "@/components/ui";
import { articleBySlug, articles, insights } from "@/lib/insights";
import { ordinal } from "@/lib/ordinal";
import { site } from "@/lib/site";

const { detail } = insights;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  return {
    title: article?.title
      ? `${article.title}${site.metadata.titleSuffix}`
      : detail.fallbackMetaTitle,
  };
}

const meta = [
  { label: detail.metaLabels.readingTime, key: "readingTime" },
  { label: detail.metaLabels.author, key: "author" },
  { label: detail.metaLabels.publisher, key: "publisher" },
  { label: detail.metaLabels.date, key: "date" },
] as const;

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();

  const body = article.body;

  return (
    <>
      <section className="bg-cream text-ink pt-40 lg:pt-48">
        <div className="wrap">
          <SectionHeader index={ordinal(0)} eyebrow={detail.articleEyebrow} />

          <div className="grid grid-cols-1 lg:grid-cols-4">
            {/* Metadata sidebar */}
            <aside className="lg:pr-8 py-14 lg:sticky lg:top-28 lg:self-start">
              {article.title ? (
                <h1 className="type-display type-h3 mb-8">{article.title}</h1>
              ) : (
                <div className="mb-8">
                  <Placeholder lead />
                </div>
              )}

              <dl className="border-t border-hair">
                {meta.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-baseline justify-between gap-4 border-b border-hair py-4"
                  >
                    <dt className="type-label text-olive">{m.label}</dt>
                    <dd className="type-link text-ink">
                      {article[m.key] ?? (
                        <span className="italic text-olive normal-case tracking-normal">
                          {detail.pendingValue}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>

            {/* Body */}
            <div className="lg:col-span-2 lg:border-l border-hair lg:pl-8 py-14 flex flex-col gap-10">
              <div className="flex flex-col gap-5">
                <h2 className="type-display type-h3">{body.openingHeading}</h2>
                {body.openingParagraphs.map((p) => (
                  <p key={p} className="type-body text-olive">
                    {p}
                  </p>
                ))}
              </div>

              <PhotoFrame
                photo={article.photo}
                className="h-64 lg:h-80"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              <div className="flex flex-col gap-5">
                <h2 className="type-display type-h3">{body.listHeading}</h2>
                <p className="type-body text-olive">{body.listIntro}</p>

                {/* Plain bulleted list — not a card grid */}
                <ul className="flex flex-col gap-2.5">
                  {body.listItems.map((item, i) => (
                    <li key={i} className="flex gap-3 items-baseline">
                      <span className="text-sage shrink-0" aria-hidden="true">
                        •
                      </span>
                      <span className="type-body text-olive">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-5">
                <h2 className="type-display type-h3">{body.closingHeading}</h2>
                {body.closingParagraphs.map((p) => (
                  <p key={p} className="type-body text-olive">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Side-note callout */}
            <div className="lg:border-l border-hair lg:pl-8 py-14">
              <BulletLabel className="text-olive">
                {detail.noteLabel}
              </BulletLabel>
              <div className="mt-4">
                <p className="type-body text-olive">{body.note}</p>
              </div>
            </div>
          </div>

          {/* Closing statement */}
          <div className="border-t border-hair py-16 lg:py-36">
            <div className="lg:[text-indent:22%] max-w-5xl">
              <p className="type-h2">{body.pullQuote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related articles — the Testimonials carousel, carrying article cards */}
      <section className="bg-black text-white">
        <div className="wrap">
          <SectionHeader
            index={ordinal(1)}
            eyebrow={detail.relatedEyebrow}
            tone="black"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="lg:col-span-1 flex flex-col justify-end py-12 lg:py-28 lg:pr-8">
              <h2 className="type-h2 mb-8">{detail.relatedTitle}</h2>
              <p className="type-body text-white/55 italic max-w-xs">
                {detail.relatedNote}
              </p>
            </div>

            <div className="hidden lg:block border-l border-hair-dark" />

            <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8">
              <Carousel>
                {[0, 1, 2].map((i) => (
                  <article
                    key={i}
                    className="snap-start shrink-0 w-[78vw] sm:w-[22rem] flex flex-col gap-5"
                  >
                    <BulletLabel className="text-white/55">
                      {detail.relatedCardLabel}
                    </BulletLabel>
                    <PhotoFrame
                      photo={{
                        src: null,
                        alt: "",
                        note: detail.relatedCardPhotoNote,
                        brightness: null,
                        textMode: "light",
                      }}
                      tone="black"
                      className="h-48"
                      sizes="352px"
                    />
                    <Placeholder tone="black" lead />
                    <Placeholder tone="black" />
                  </article>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      <RequestSection index={ordinal(2)} variant="briefings" />
    </>
  );
}
