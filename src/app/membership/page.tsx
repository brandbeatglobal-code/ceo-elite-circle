import { Accordion } from "@/components/Accordion";
import { CandidacyChecklist } from "@/components/CandidacyChecklist";
import { FeatureGrid } from "@/components/FeatureGrid";
import { Icon } from "@/components/Icons";
import { NumberedSteps } from "@/components/NumberedSteps";
import { PageHero } from "@/components/PageHero";
import { RequestSection } from "@/components/RequestSection";
import {
  ArrowLink,
  BulletLabel,
  PhotoFrame,
  SectionHeader,
} from "@/components/ui";
import { membership } from "@/lib/membership";
import { ordinal } from "@/lib/ordinal";

export const metadata = { title: membership.metaTitle };

/* SAMPLE COPY throughout `content/membership.json`. Category descriptions say
   what each category involves; they state no fee and no entitlement that reads
   as a term. */

const { hero, whoShouldJoin, categories, benefits, journey, faq } = membership;

export default function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        intro={hero.intro}
      />

      <CandidacyChecklist
        index={ordinal(0)}
        eyebrow={whoShouldJoin.eyebrow}
        title={whoShouldJoin.title}
        intro={whoShouldJoin.intro}
        criteria={whoShouldJoin.criteria}
      />

      {/* Membership categories — horizontal rows, one per category */}
      <section className="bg-black text-white">
        <div className="wrap">
          <SectionHeader
            index={ordinal(1)}
            eyebrow={categories.eyebrow}
            tone="black"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair-dark">
            <h2
              className="type-h2 lg:col-span-2 py-12 lg:py-24 lg:pr-10"
              data-reveal
            >
              {categories.title}
            </h2>
            <div
              className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 pb-12 lg:py-24"
              data-reveal
              style={{ transitionDelay: "80ms" }}
            >
              <p className="type-lead text-white max-w-lg">
                {categories.intro}
              </p>
            </div>
          </div>

          {categories.items.map((tier, i) => (
            <div
              key={tier.name}
              className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair-dark"
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className="flex flex-col justify-between py-16 lg:py-14 lg:pr-8 gap-8">
                <BulletLabel className="text-white/60">
                  {categories.rowLabel}
                </BulletLabel>
                <ArrowLink href="/contact" tone="black">
                  {categories.rowLinkLabel}
                </ArrowLink>
              </div>

              <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 py-16 lg:py-14 flex flex-col justify-between gap-8">
                <p className="type-lead text-white max-w-md">{tier.body}</p>
                <h3 className="type-display text-2xl md:text-3xl text-white">
                  {tier.name}
                </h3>
              </div>

              <div className="lg:border-l border-hair-dark lg:pl-8 py-16 lg:py-14">
                <PhotoFrame
                  photo={tier.photo}
                  tone="black"
                  greyscale
                  hover
                  className="h-40 lg:h-44"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <FeatureGrid
        index={ordinal(2)}
        eyebrow={benefits.eyebrow}
        title={benefits.title}
        intro={
          <p className="type-lead text-white max-w-lg">{benefits.intro}</p>
        }
        features={benefits.features.map((f) => ({
          icon: <Icon name={f.icon} className="w-full h-full" />,
          label: f.label,
          body: f.body,
        }))}
      />

      <NumberedSteps
        index={ordinal(3)}
        eyebrow={journey.eyebrow}
        title={journey.title}
        intro={journey.intro}
        steps={journey.steps}
        tone="cream"
      />

      {/* FAQ — accordion */}
      <section className="bg-cream text-ink">
        <div className="wrap">
          <SectionHeader index={ordinal(4)} eyebrow={faq.eyebrow} />
          <div className="grid grid-cols-1 lg:grid-cols-4 py-12 lg:py-24 gap-10">
            <div className="lg:col-span-2 lg:pr-10" data-reveal>
              <h2 className="type-h2 mb-8">{faq.title}</h2>
              <p className="type-lead max-w-md">{faq.intro}</p>
            </div>
            <div
              className="lg:col-span-2 lg:border-l border-hair lg:pl-8"
              data-reveal
              style={{ transitionDelay: "90ms" }}
            >
              <Accordion
                items={faq.items.map((f) => ({
                  title: f.title,
                  body: <p className="type-body text-olive">{f.body}</p>,
                }))}
              />
            </div>
          </div>
        </div>
      </section>

      <RequestSection index={ordinal(5)} variant="application" />
    </>
  );
}
