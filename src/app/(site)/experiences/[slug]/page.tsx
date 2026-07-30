import { notFound } from "next/navigation";
import { CandidacyChecklist } from "@/components/CandidacyChecklist";
import { DetailHero } from "@/components/DetailHero";
import { NumberedSteps } from "@/components/NumberedSteps";
import { RequestSection } from "@/components/RequestSection";
import { Section } from "@/components/Section";
import {
  experienceBySlug,
  experiences,
  experiencesContent,
} from "@/lib/experiences";
import { ordinal } from "@/lib/ordinal";
import { site } from "@/lib/site";

const { detail } = experiencesContent;

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
      ? `${experience.name}${site.metadata.titleSuffix}`
      : detail.fallbackMetaTitle,
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
        eyebrow={detail.heroEyebrow}
        title={experience.name}
        summary={experience.summary}
        photo={experience.photo}
      />

      <Section
        index={next()}
        eyebrow={detail.aboutEyebrow}
        title={experience.name}
      >
        <p className="type-lead text-ink">{experience.intro}</p>
      </Section>

      <CandidacyChecklist
        index={next()}
        eyebrow={detail.criteriaEyebrow}
        title={detail.criteriaTitle}
        intro={detail.criteriaIntro}
        criteria={experience.criteria}
        tone="black"
      />

      <NumberedSteps
        index={next()}
        eyebrow={detail.stepsEyebrow}
        title={detail.stepsTitle}
        intro={detail.stepsIntro}
        steps={experience.steps}
        tone="cream"
      />

      <RequestSection
        index={next()}
        variant="experience"
        context={{
          label: detail.requestContextLabel,
          value: experience.name,
        }}
      />
    </>
  );
}
