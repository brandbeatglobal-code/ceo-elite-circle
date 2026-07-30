import { FeatureGrid } from "@/components/FeatureGrid";
import { Icon } from "@/components/Icons";
import { NumberedSteps } from "@/components/NumberedSteps";
import { PageHero } from "@/components/PageHero";
import { RequestSection } from "@/components/RequestSection";
import { Section } from "@/components/Section";
import { VariantCards } from "@/components/VariantCards";
import { Placeholder } from "@/components/ui";
import { councils } from "@/lib/councils";
import { ordinal } from "@/lib/ordinal";

export const metadata = { title: councils.metaTitle };

/* SAMPLE COPY in `content/councils.json`, except Expert Advisors, which names
   real people and so carries only a placeholder note. */

const { hero, purpose, format, benefits, calendar, advisors } = councils;

export default function CouncilsPage() {
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        intro={hero.intro}
      />

      <Section index={ordinal(0)} eyebrow={purpose.eyebrow} title={purpose.title}>
        <p className="type-lead text-ink">{purpose.lead}</p>
        <p className="type-body text-olive">{purpose.body}</p>
      </Section>

      <VariantCards
        index={ordinal(1)}
        eyebrow={councils.councils.eyebrow}
        title={councils.councils.title}
        intro={councils.councils.intro}
        variants={councils.councils.items}
        tone="black"
      />

      <NumberedSteps
        index={ordinal(2)}
        eyebrow={format.eyebrow}
        title={format.title}
        intro={format.intro}
        steps={format.steps}
        tone="cream"
      />

      <FeatureGrid
        index={ordinal(3)}
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
        index={ordinal(4)}
        eyebrow={calendar.eyebrow}
        title={calendar.title}
        intro={calendar.intro}
        steps={calendar.steps}
        tone="cream"
      />

      <Section
        index={ordinal(5)}
        eyebrow={advisors.eyebrow}
        title={advisors.title}
      >
        <Placeholder note={advisors.placeholderNote} />
      </Section>

      <RequestSection index={ordinal(6)} variant="council" />
    </>
  );
}
