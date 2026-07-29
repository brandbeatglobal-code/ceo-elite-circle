import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

export default function CouncilsPage() {
  return (
    <>
      <PageHero eyebrow="Executive Councils" title="Executive Councils" />
      <Section title="Purpose" tone="stone" />
      <Section title="Councils" />
      <Section title="Meeting Format" tone="stone" />
      <Section title="Benefits" />
      <Section title="Annual Calendar" tone="stone" />
      <Section title="Expert Advisors" />
    </>
  );
}
