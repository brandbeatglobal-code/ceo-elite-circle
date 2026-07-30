import { Fragment } from "react";
import { MediaSection } from "@/components/MediaSection";
import { Carousel } from "@/components/Carousel";
import { PhotoCard } from "@/components/PhotoCard";
import { RequestSection } from "@/components/RequestSection";
import {
  ArrowLink,
  BulletLabel,
  PhotoFrame,
  PillButton,
  Placeholder,
  SectionHeader,
} from "@/components/ui";
import { home } from "@/lib/home";
import { ordinal } from "@/lib/ordinal";
import { pillars } from "@/lib/pillars";
import { experiences } from "@/lib/experiences";
import { membership } from "@/lib/membership";

const {
  hero,
  philosophy,
  pillars: pillarsSection,
  whyNow,
  categories,
  governance,
  experiences: experiencesSection,
  testimonials,
} = home;

/* Categories are read from `content/membership.json`, not duplicated here, so
   this teaser and the full page cannot drift apart. */
const tiers = membership.categories.items;

const featured = experiences.find(
  (e) => e.slug === experiencesSection.featuredSlug,
)!;
const otherExperiences = experiences.filter((e) => e !== featured);

export default function Home() {
  return (
    <>
      {/* ---- Hero — full-bleed photograph, serif headline, full-width pill CTA */}
      <section className="relative min-h-[calc(100svh-var(--banner-h))] flex flex-col justify-end overflow-hidden">
        <PhotoFrame
          photo={hero.photo}
          cover
          className="h-full"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />

        {/* The hairline grid carries over the photograph */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          <div className="wrap h-full grid grid-cols-4">
            <div />
            <div className="border-l border-white/15" />
            <div className="border-l border-white/15" />
            <div className="border-l border-white/15" />
          </div>
        </div>

        <div className="wrap relative pt-36 lg:pt-44 hero-foot">
          {/* The breaks are deliberate — the last line is indented at `lg`, so
              it has to be its own line. */}
          <h1 className="type-display type-hero text-white mb-6 lg:mb-10">
            {hero.headline.map((line, i) => (
              <Fragment key={line}>
                {i > 0 && <br />}
                {i === hero.headline.length - 1 ? (
                  <span className="lg:ml-[18%]">{line}</span>
                ) : (
                  line
                )}
              </Fragment>
            ))}
          </h1>

          <div className="max-w-sm mb-6 lg:mb-10">
            <p className="type-body text-white mb-3">{hero.lead}</p>
            <p className="type-body text-white/75">{hero.body}</p>
          </div>

          <PillButton href="/contact" variant="outline" className="w-full">
            {hero.cta}
          </PillButton>
        </div>
      </section>

      {/* ---- One — Our Philosophy */}
      <section className="bg-ramp text-white">
        <div className="wrap">
          <SectionHeader
            index={ordinal(0)}
            eyebrow={philosophy.eyebrow}
            link={{ href: "/about", label: philosophy.headerLinkLabel }}
            tone="ramp"
          />

          <div className="pt-24 pb-16 lg:pt-52 lg:pb-40">
            {/* Staggered headline — begins mid-grid, then runs full width */}
            <h2 className="type-h2 lg:[text-indent:44%] max-w-6xl">
              {philosophy.title}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-14 mt-24 lg:mt-48">
              <div className="hidden lg:block" />
              <div className="lg:border-l border-hair-dark lg:pl-8 flex flex-col items-start gap-8">
                <p className="type-lead text-white max-w-sm">
                  {philosophy.lead}
                </p>
              </div>
              <div className="lg:border-l border-hair-dark lg:pl-8 flex flex-col items-start gap-8">
                <p className="type-body text-white/75 max-w-sm">
                  {philosophy.body}
                </p>
                <ArrowLink href="/about" tone="ramp">
                  {philosophy.linkLabel}
                </ArrowLink>
              </div>
              <div className="hidden lg:block" />
            </div>
          </div>
        </div>
      </section>

      {/* ---- Two — The Five Pillars */}
      <section className="bg-black text-white">
        <div className="wrap">
          <SectionHeader
            index={ordinal(1)}
            eyebrow={pillarsSection.eyebrow}
            link={{ href: "/pillars", label: pillarsSection.headerLinkLabel }}
            tone="black"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair-dark">
            <h2 className="type-h2 col-span-1 lg:col-span-2 py-12 lg:py-24 lg:pr-10">
              {pillarsSection.title}
            </h2>
            <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 pb-12 lg:py-24">
              <p className="type-lead text-white max-w-lg">
                {pillarsSection.lead}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-hair-dark">
            {pillars.map((pillar, i) => (
              <PhotoCard
                key={pillar.slug}
                label={pillarsSection.cardLabel}
                index={ordinal(i)}
                title={pillar.name}
                body={pillar.summary}
                photo={pillar.photo}
                href={`/pillars/${pillar.slug}`}
                linkLabel={pillarsSection.cardLinkLabel}
                delay={i * 70}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---- Three — Why Now */}
      <MediaSection
        index={ordinal(2)}
        eyebrow={whyNow.eyebrow}
        title={whyNow.title}
        photo={whyNow.photo}
        link={{ href: "/about", label: whyNow.linkLabel }}
      >
        <p className="type-lead text-ink max-w-md">{whyNow.lead}</p>
        <p className="type-body text-olive max-w-md">{whyNow.body}</p>
      </MediaSection>

      {/* ---- Four — Membership Categories */}
      <section className="bg-cream text-ink">
        <div className="wrap">
          <SectionHeader
            index={ordinal(3)}
            eyebrow={categories.eyebrow}
            link={{ href: "/membership", label: categories.headerLinkLabel }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair">
            <h2 className="type-h2 lg:col-span-2 py-12 lg:py-24 lg:pr-10">
              {categories.title}
            </h2>
            <div className="lg:col-span-2 lg:border-l border-hair lg:pl-8 pb-12 lg:py-24">
              <p className="type-lead text-ink max-w-lg">
                {membership.categories.intro}
              </p>
            </div>
          </div>

          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair"
            >
              <div className="flex flex-col justify-between py-16 lg:py-14 lg:pr-8 gap-8">
                <BulletLabel className="text-olive">
                  {categories.rowLabel}
                </BulletLabel>
                <ArrowLink href="/membership">
                  {categories.rowLinkLabel}
                </ArrowLink>
              </div>

              <div className="lg:col-span-2 lg:border-l border-hair lg:pl-8 py-16 lg:py-14 flex flex-col justify-between gap-8">
                <p className="type-lead text-ink max-w-md">{tier.body}</p>
                <h3 className="type-body text-ink">{tier.name}</h3>
              </div>

              <div className="lg:border-l border-hair lg:pl-8 py-16 lg:py-14">
                <PhotoFrame
                  photo={tier.photo}
                  greyscale
                  className="h-40 lg:h-44"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Five — Governance and selection */}
      <section className="bg-cream text-ink">
        <div className="wrap">
          <SectionHeader
            index={ordinal(4)}
            eyebrow={governance.eyebrow}
            link={{ href: "/trust", label: governance.headerLinkLabel }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-10 pt-16 pb-16 lg:pt-44 lg:pb-36">
            <div className="flex flex-col items-start gap-8 lg:pr-8 order-2 lg:order-1 lg:justify-end">
              <p className="type-lead max-w-xs">{governance.lead}</p>
              <ArrowLink href="/trust">
                {governance.primaryLinkLabel}
              </ArrowLink>
            </div>

            <div className="flex flex-col items-start gap-8 lg:border-l border-hair lg:pl-8 order-3 lg:order-2 lg:justify-end">
              <p className="type-body text-olive max-w-xs">
                {governance.body}
              </p>
              <ArrowLink href="/membership">
                {governance.secondaryLinkLabel}
              </ArrowLink>
            </div>

            <div className="lg:col-span-2 lg:border-l border-hair lg:pl-10 order-1 lg:order-3">
              <h2 className="type-h2 max-w-xl">{governance.title}</h2>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Six — Signature Experiences */}
      <section className="bg-black text-white">
        <div className="wrap">
          <SectionHeader
            index={ordinal(5)}
            eyebrow={experiencesSection.eyebrow}
            link={{
              href: "/experiences",
              label: experiencesSection.headerLinkLabel,
            }}
            tone="black"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair-dark">
            <h2 className="type-h2 lg:col-span-2 py-12 lg:py-24 lg:pr-10">
              {experiencesSection.title}
            </h2>
            <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 pb-12 lg:py-24">
              <p className="type-lead text-white max-w-lg">
                {experiencesSection.lead}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4">
            {/* Featured experience — text beside its photograph */}
            <div className="py-14 lg:pr-8 flex flex-col justify-between gap-10">
              <div>
                <h3 className="type-display type-h3 text-white mb-5">
                  {featured.name}
                </h3>
                <p className="type-body text-white/70">{featured.summary}</p>
              </div>
              <ArrowLink href={`/experiences/${featured.slug}`} tone="black">
                {experiencesSection.featuredLinkLabel}
              </ArrowLink>
            </div>

            <div className="lg:border-l border-hair-dark lg:pl-8 py-14">
              <PhotoFrame
                photo={featured.photo}
                className="h-72 lg:h-full lg:min-h-[24rem]"
                sizes="(max-width: 1024px) 100vw, 25vw"
                tone="black"
              />
            </div>

            {/* The remaining six, as a hairline list */}
            <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 py-14">
              {otherExperiences.map((experience) => (
                <div
                  key={experience.slug}
                  className="flex items-baseline justify-between gap-6 border-b border-hair-dark py-5 first:pt-0"
                >
                  <h3 className="type-display text-xl md:text-2xl text-white">
                    {experience.name}
                  </h3>
                  <ArrowLink
                    href={`/experiences/${experience.slug}`}
                    tone="black"
                    className="shrink-0"
                  >
                    {experiencesSection.listLinkLabel}
                  </ArrowLink>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Seven — Testimonials */}
      <section className="bg-black text-white">
        <div className="wrap">
          <SectionHeader
            index={ordinal(6)}
            eyebrow={testimonials.eyebrow}
            tone="black"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="lg:col-span-1 flex flex-col justify-end py-12 lg:py-28 lg:pr-8">
              <h2 className="type-h2 mb-8">{testimonials.title}</h2>
              <p className="type-body text-white/55 italic max-w-xs">
                {testimonials.note}
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
                      {testimonials.cardLabel}
                    </BulletLabel>
                    <Placeholder tone="black" />
                  </article>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Eight — Request Membership Consideration */}
      <RequestSection index={ordinal(7)} />
    </>
  );
}
