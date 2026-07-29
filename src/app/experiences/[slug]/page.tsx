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
        photo={experience.photo}
      />

      <Section index={next()} eyebrow="About" title={experience.name} />

      <CandidacyChecklist
        index={next()}
        eyebrow="Who it is for"
        title="Who attends"
        tone="black"
      />

      {experience.steps && (
        <NumberedSteps
          index={next()}
          eyebrow="Taking part"
          title="Before you attend"
          tone="cream"
        />
      )}

      <RequestSection index={next()} />
    </>
  );
}
