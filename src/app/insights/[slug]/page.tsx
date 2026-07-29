import { notFound } from "next/navigation";
import { Carousel } from "@/components/Carousel";
import { RequestSection } from "@/components/RequestSection";
import {
  BulletLabel,
  PhotoFrame,
  Placeholder,
  SectionHeader,
} from "@/components/ui";
import { articleBySlug, articles } from "@/lib/insights";
import { ordinal } from "@/lib/ordinal";

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
      ? `${article.title} — CEO Elite Circle`
      : "Insights — CEO Elite Circle",
  };
}

const listItems = [
  "A question can be described accurately, rather than in the version prepared for the board.",
  "Disagreement costs nothing, so the strongest objection actually gets voiced.",
  "Nobody is performing for a promotion, an investor, or the room itself.",
  "Being wrong out loud carries no consequence beyond the conversation.",
];

const meta = [
  { label: "Reading time", key: "readingTime" },
  { label: "Author", key: "author" },
  { label: "Published by", key: "publisher" },
  { label: "Date of publication", key: "date" },
] as const;

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <section className="bg-cream text-ink pt-32 lg:pt-40">
        <div className="wrap">
          <SectionHeader index={ordinal(0)} eyebrow="Article" />

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
                          pending
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
                <h2 className="type-display type-h3">
                  The problem with good advice
                </h2>
                <p className="type-body text-olive">
                  A chief executive is rarely short of input. Boards offer
                  direction, advisers offer options, and the market offers an
                  opinion whether or not one was sought. What is scarce is the
                  conversation that asks nothing in return.
                </p>
                <p className="type-body text-olive">
                  The distinction matters more than it sounds. Advice arrives
                  with a position already taken. Counsel begins by establishing
                  what the question actually is, which is often not the question
                  that was brought into the room.
                </p>
              </div>

              <PhotoFrame
                photo={article.photo}
                className="h-64 lg:h-80"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              <div className="flex flex-col gap-5">
                <h2 className="type-display type-h3">What a closed room allows</h2>
                <p className="type-body text-olive">
                  Once a conversation is genuinely private, several things
                  become possible that are not possible anywhere else:
                </p>

                {/* Plain bulleted list — not a card grid */}
                <ul className="flex flex-col gap-2.5">
                  {listItems.map((item, i) => (
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
                <h2 className="type-display type-h3">Where this leaves a chair</h2>
                <p className="type-body text-olive">
                  None of this removes the weight of the decision. The chief
                  executive still signs, still answers for it, and still carries
                  the consequence alone. What changes is the quality of thinking
                  that precedes the signature.
                </p>
                <p className="type-body text-olive">
                  That is the whole of the argument for a room like this one,
                  and it is a narrower claim than most gatherings make.
                </p>
              </div>
            </div>

            {/* Side-note callout */}
            <div className="lg:border-l border-hair lg:pl-8 py-14">
              <BulletLabel className="text-olive">Note</BulletLabel>
              <div className="mt-4">
                <p className="type-body text-olive">
                  Members raise questions ahead of each forum, so the session is
                  shaped by the room rather than presented to it.
                </p>
              </div>
            </div>
          </div>

          {/* Closing statement */}
          <div className="border-t border-hair py-24 lg:py-36">
            <div className="lg:[text-indent:22%] max-w-5xl">
              <p className="type-h2">
                The scarcest thing at this level is not information. It is a
                room with nothing to sell.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related articles — the Testimonials carousel, carrying article cards */}
      <section className="bg-black text-white">
        <div className="wrap">
          <SectionHeader index={ordinal(1)} eyebrow="Related articles" tone="black" />

          <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="lg:col-span-1 flex flex-col justify-end py-16 lg:py-28 lg:pr-8">
              <h2 className="type-h2 mb-8">Further reading</h2>
              <p className="type-body text-white/55 italic max-w-xs">
                No other articles have been published yet, so none are linked —
                these cards are structure only.
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
                      Article pending
                    </BulletLabel>
                    <PhotoFrame
                      photo={{
                        src: null,
                        alt: "",
                        note: "the article's lead image.",
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

      <RequestSection index={ordinal(2)} />
    </>
  );
}
