import { PageHero } from "@/components/PageHero";
import { RequestSection } from "@/components/RequestSection";
import { Section } from "@/components/Section";
import { ordinal } from "@/lib/ordinal";

const sections = [
  "Purpose",
  "Councils",
  "Meeting Format",
  "Benefits",
  "Annual Calendar",
  "Expert Advisors",
];

export default function CouncilsPage() {
  return (
    <>
      <PageHero eyebrow="Executive Councils" title="Executive Councils" />
      {sections.map((title, i) => (
        <Section key={title} index={ordinal(i)} title={title} />
      ))}
      <RequestSection index={ordinal(sections.length)} />
    </>
  );
}
