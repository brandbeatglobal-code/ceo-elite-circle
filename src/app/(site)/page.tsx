import { Fragment } from "react";
import { Carousel } from "@/components/Carousel";
import { CategoryRows } from "@/components/CategoryRows";
import { ExperienceShowcase } from "@/components/ExperienceShowcase";
import { MediaSection } from "@/components/MediaSection";
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
import { photoText, scrimVars } from "@/lib/images";
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

/* The occasion the panel falls back to whenever nothing is hovered or pinned.
   Resolved here rather than inside the component, and still with the non-null
   assertion, so a `featuredSlug` matching no experience fails the build rather
   than rendering an empty panel — which is what `docs/content-inventory.md`
   promises of that field. */
const featured = experiences.find(
  (e) => e.slug === experiencesSection.featuredSlug,
)!;

/* Light or dark copy over the hero photograph, from the slot's own text mode.
   `Nav` reads the same field for this route, so the bar and the headline
   under it cannot end up on opposite sides of it. */
const heroText = photoText(hero.photo);

export default function Home() {
  return (
    <>
      {/* ---- Hero — full-bleed photograph, serif headline, full-width pill CTA */}
      <section
        className="relative min-h-[calc(100svh-var(--banner-h))] flex flex-col justify-end overflow-hidden"
        style={hero.photo.src ? scrimVars(hero.photo) : undefined}
      >
        <PhotoFrame
          photo={hero.photo}
          cover
          className="h-full"
          sizes="100vw"
        />
        {hero.photo.src && <div className="photo-scrim-nav" />}

        {/* The hairline grid carries over the photograph */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          <div className="wrap h-full grid grid-cols-4">
            <div />
            <div className={`border-l ${heroText.rule}`} />
            <div className={`border-l ${heroText.rule}`} />
            <div className={`border-l ${heroText.rule}`} />
          </div>
        </div>

        {/* The copy carries its own field, so the headline stays legible over
            a bright photograph as well as a dark one. The padding here is what
            `.copy-scrim` fades across — keep the two in step. */}
        <div
          className={`relative pt-36 lg:pt-44 ${hero.photo.src ? "copy-scrim" : ""}`}
        >
          <div className="wrap hero-foot">
            {/* The breaks are deliberate — the last line is indented at `lg`,
                so it has to be its own line. */}
            <h1
              className={`type-display type-hero ${heroText.strong} mb-6 lg:mb-10`}
            >
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
              <p className={`type-body ${heroText.strong} mb-3`}>{hero.lead}</p>
              <p className={`type-body ${heroText.label}`}>{hero.body}</p>
            </div>

            <PillButton
              href="/contact"
              variant={heroText.pill}
              className="w-full"
            >
              {hero.cta}
            </PillButton>
          </div>
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
            {/* Staggered headline — begins mid-grid, then runs full width.
                `text-indent` only ever indents the *first* line, so a headline
                that outgrows that line drops its remainder to the left margin.
                For a long headline that is the intended shape; for a short one
                it reads as a break in the middle of a phrase, which is what
                44% produced. The container caps at max-w-6xl while `type-h2`
                keeps growing to 4.25rem at about 1545px, so the first line
                stayed 645px while the text needed 686px — it wrapped from
                1536px up, and cleared 1440px by only six pixels, which is why
                it also went depending on the browser. 34% leaves 760px: about
                75px spare at the largest type and 120px at 1440. */}
            <h2 className="type-h2 lg:[text-indent:34%] max-w-6xl">
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
                {/* One of eleven links on this page reading "Discover the
                    Circle". The section it closes is what tells a visitor
                    which one it is, so the accessible name says it. */}
                <ArrowLink
                  href="/about"
                  tone="ramp"
                  ariaLabel={`${philosophy.linkLabel}: ${philosophy.title}`}
                >
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

          {/* Same component `/membership` renders, so the two cannot drift
              again. Only the tone and this page's own link differ. */}
          <CategoryRows
            items={tiers}
            rowLabel={categories.rowLabel}
            link={{ href: "/membership", label: categories.rowLinkLabel }}
          />
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
              {/* Same again. The sibling link beside it already says
                  "Membership Selection" and needs nothing. */}
              <ArrowLink
                href="/trust"
                ariaLabel={`${governance.primaryLinkLabel}: ${governance.title}`}
              >
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

          {/* Interactive: hovering or focusing a row previews it in the panel,
              clicking or tapping pins it. See `ExperienceShowcase`. */}
          <ExperienceShowcase
            items={experiences}
            defaultSlug={featured.slug}
            featuredLinkLabel={experiencesSection.featuredLinkLabel}
            listLinkLabel={experiencesSection.listLinkLabel}
          />
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
              {testimonials.items.every((t) => t.quote === null) && (
                <p className="type-body text-white/55 italic max-w-xs">
                  {testimonials.note}
                </p>
              )}
            </div>

            <div className="hidden lg:block border-l border-hair-dark" />

            <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8">
              <Carousel>
                {testimonials.items.map((item, i) => (
                  <article
                    key={i}
                    className="snap-start shrink-0 w-[78vw] sm:w-[22rem] flex flex-col gap-5"
                  >
                    {/* A card follows its content: real words get quoted, an
                        empty slot keeps the labelled waiting frame.

                        On a filled card the attribution takes the label's own
                        position at the top, in the same sage-bulleted
                        treatment. These attributions are a role and an
                        industry rather than a name, at the members' request,
                        so the attribution *is* what the label would otherwise
                        have said — "Member" above "CEO, Heavy Manufacturing"
                        would say the same thing twice. `memberLabel` still
                        covers the half-finished case: a quote whose
                        attribution has not been agreed yet. */}
                    {item.quote ? (
                      <figure className="flex flex-col items-start gap-5">
                        <figcaption>
                          <BulletLabel className="text-white/75">
                            {item.attribution ?? testimonials.memberLabel}
                          </BulletLabel>
                        </figcaption>
                        <blockquote className="type-lead text-white">
                          &ldquo;{item.quote}&rdquo;
                        </blockquote>
                        {!item.attribution && (
                          <Placeholder
                            tone="black"
                            note={testimonials.attributionNote}
                          />
                        )}
                      </figure>
                    ) : (
                      <>
                        <BulletLabel className="text-white/55">
                          {testimonials.cardLabel}
                        </BulletLabel>
                        <Placeholder tone="black" />
                      </>
                    )}
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
