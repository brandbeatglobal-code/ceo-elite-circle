import { notFound } from "next/navigation";
import { CandidacyChecklist } from "@/components/CandidacyChecklist";
import { DetailHero } from "@/components/DetailHero";
import { NumberedSteps } from "@/components/NumberedSteps";
import { RequestSection } from "@/components/RequestSection";
import { Section } from "@/components/Section";
import { experienceBySlug, experiences } from "@/lib/experiences";
import { ordinal } from "@/lib/ordinal";

export function generateStaticParams() {
  return experiences.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = experienceBySlug(slug);
  return {
    title: experience
      ? `${experience.name} — CEO Elite Circle`
      : "CEO Elite Circle",
  };
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = experienceBySlug(slug);
  if (!experience) notFound();

  let n = 0;
  const next = () => ordinal(n++);

  return (
    <>
      <DetailHero
        eyebrow="Signature Experience"
        title={experience.name}
        summary={experience.summary}
        photo={experience.photo}
      />

      <Section index={next()} eyebrow="About" title={experience.name}>
        <p className="type-lead text-ink">{experience.intro}</p>
      </Section>

      <CandidacyChecklist
        index={next()}
        eyebrow="Who it is for"
        title="Who attends"
        intro="Every signature experience suits a particular frame of mind as much as a particular seniority."
        criteria={experience.criteria}
        tone="black"
      />

      <NumberedSteps
        index={next()}
        eyebrow="Taking part"
        title="Before you attend"
        intro="A short sequence, so that the time in the room is spent well."
        steps={experience.steps}
        tone="cream"
      />

      <RequestSection index={next()} />
    </>
  );
}
