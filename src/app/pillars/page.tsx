import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

export default function PillarsPage() {
  return (
    <>
      <PageHero
        eyebrow="Structure"
        title="The Five Pillars"
        intro="Each pillar below will expand into its own full section, with benefits, outcomes, and examples once the content pass begins."
      />
      <Section eyebrow="Pillar One" title="Strategic Advisory" tone="stone" />
      <Section eyebrow="Pillar Two" title="Elite Network" />
      <Section eyebrow="Pillar Three" title="Executive Forums" tone="stone" />
      <Section eyebrow="Pillar Four" title="Knowledge & Insights" />
      <Section eyebrow="Pillar Five" title="Executive Councils" tone="stone" />
    </>
  );
}
