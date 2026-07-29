import { PageHero } from "@/components/PageHero";
import { RequestSection } from "@/components/RequestSection";
import { Section } from "@/components/Section";
import { ordinal } from "@/lib/ordinal";

const pillars = [
  "Strategic Advisory",
  "Elite Network",
  "Executive Forums",
  "Knowledge & Insights",
  "Executive Councils",
];

export default function PillarsPage() {
  return (
    <>
      <PageHero
        eyebrow="Structure"
        title="The Five Pillars"
        intro="Each pillar below will expand into its own full section, with benefits, outcomes, and examples once the content pass begins."
      />
      {pillars.map((title, i) => (
        <Section
          key={title}
          index={ordinal(i)}
          eyebrow={`Pillar ${ordinal(i)}`}
          title={title}
          tone={i % 2 === 1 ? "black" : "cream"}
        />
      ))}
      <RequestSection index={ordinal(pillars.length)} />
    </>
  );
}
