import { PageHero } from "@/components/PageHero";
import { RequestSection } from "@/components/RequestSection";
import { Section } from "@/components/Section";
import { ArrowLink, Placeholder } from "@/components/ui";
import { pillars } from "@/lib/pillars";
import { ordinal } from "@/lib/ordinal";

export default function PillarsPage() {
  return (
    <>
      <PageHero
        eyebrow="Structure"
        title="The Five Pillars"
        intro="Each pillar below will expand into its own full section, with benefits, outcomes, and examples once the content pass begins."
      />
      {pillars.map((pillar, i) => {
        const tone = i % 2 === 1 ? "black" : "cream";
        return (
          <Section
            key={pillar.slug}
            index={ordinal(i)}
            eyebrow={`Pillar ${ordinal(i)}`}
            title={pillar.name}
            tone={tone}
          >
            <Placeholder tone={tone} />
            {/* In the body rather than the header row: the header's arrow link
                is hidden below lg, and this is the only route to the page. */}
            <ArrowLink href={`/pillars/${pillar.slug}`} tone={tone}>
              Discover the Circle
            </ArrowLink>
          </Section>
        );
      })}
      <RequestSection index={ordinal(pillars.length)} />
    </>
  );
}
