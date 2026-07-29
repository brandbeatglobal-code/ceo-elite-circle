import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { ordinal } from "@/lib/ordinal";

const experiences = [
  "CEO Leadership Summit",
  "Chairman's Majlis",
  "Executive Leadership Retreat",
  "Future Leadership Forum",
  "CEO Excellence Awards",
  "International CEO Delegation",
  "CEO Private Dinners",
];

export default function ExperiencesPage() {
  return (
    <>
      <PageHero eyebrow="Signature Experiences" title="Signature Experiences" />
      {experiences.map((title, i) => (
        <Section
          key={title}
          index={ordinal(i)}
          title={title}
          tone={i % 2 === 1 ? "black" : "cream"}
        />
      ))}
    </>
  );
}
