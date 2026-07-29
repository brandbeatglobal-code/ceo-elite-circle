import { PageHero } from "@/components/PageHero";
import { RequestSection } from "@/components/RequestSection";
import { Section } from "@/components/Section";
import { ArrowLink, Placeholder } from "@/components/ui";
import { experiences } from "@/lib/experiences";
import { ordinal } from "@/lib/ordinal";

export default function ExperiencesPage() {
  return (
    <>
      <PageHero eyebrow="Signature Experiences" title="Signature Experiences" />
      {experiences.map((experience, i) => {
        const tone = i % 2 === 1 ? "black" : "cream";
        return (
          <Section
            key={experience.slug}
            index={ordinal(i)}
            title={experience.name}
            tone={tone}
          >
            <Placeholder tone={tone} />
            {/* In the body rather than the header row: the header's arrow link
                is hidden below lg, and this is the only route to the page. */}
            <ArrowLink href={`/experiences/${experience.slug}`} tone={tone}>
              Discover the Circle
            </ArrowLink>
          </Section>
        );
      })}
      <RequestSection index={ordinal(experiences.length)} />
    </>
  );
}
