import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

export default function ExperiencesPage() {
  return (
    <>
      <PageHero eyebrow="Signature Experiences" title="Signature Experiences" />
      <Section title="CEO Leadership Summit" tone="stone" />
      <Section title="Chairman's Majlis" />
      <Section title="Executive Leadership Retreat" tone="stone" />
      <Section title="Future Leadership Forum" />
      <Section title="CEO Excellence Awards" tone="stone" />
      <Section title="International CEO Delegation" />
      <Section title="CEO Private Dinners" tone="stone" />
    </>
  );
}
