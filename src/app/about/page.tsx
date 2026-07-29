import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { ordinal } from "@/lib/ordinal";

const sections = [
  "Our Story",
  "Our Purpose",
  "Our Beliefs",
  "Our Mission",
  "Our Vision",
  "Leadership Philosophy",
  "Who We Serve",
  "What Makes Us Different",
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="The Circle" title="About the Circle" />
      {sections.map((title, i) => (
        <Section key={title} index={ordinal(i)} title={title} />
      ))}
    </>
  );
}
