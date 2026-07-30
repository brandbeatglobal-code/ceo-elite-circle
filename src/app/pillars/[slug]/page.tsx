import { notFound } from "next/navigation";
import { CandidacyChecklist } from "@/components/CandidacyChecklist";
import { DetailHero } from "@/components/DetailHero";
import { RequestSection } from "@/components/RequestSection";
import { Section } from "@/components/Section";
import { VariantCards } from "@/components/VariantCards";
import { pillarBySlug, pillars, pillarsContent } from "@/lib/pillars";
import { ordinal } from "@/lib/ordinal";
import { site } from "@/lib/site";

const { detail } = pillarsContent;

export function generateStaticParams() {
  return pillars.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pillar = pillarBySlug(slug);
  return {
    title: pillar
      ? `${pillar.name}${site.metadata.titleSuffix}`
      : detail.fallbackMetaTitle,
  };
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pillar = pillarBySlug(slug);
  if (!pillar) notFound();

  // Numbered in the order they actually render, so a pillar without the
  // variants section still runs One, Two, Three.
  let n = 0;
  const next = () => ordinal(n++);

  return (
    <>
      <DetailHero
        eyebrow={detail.heroEyebrow}
        title={pillar.name}
        summary={pillar.summary}
        photo={pillar.photo}
      />

      <Section index={next()} eyebrow={detail.aboutEyebrow} title={pillar.name}>
        <p className="type-lead text-ink">{pillar.intro}</p>
      </Section>

      {pillar.variants && (
        <VariantCards
          index={next()}
          eyebrow={detail.variantsEyebrow}
          title={detail.variantsTitle}
          // The one templated string on the site — see `content-inventory.md`.
          intro={detail.variantsIntro.replace("{name}", pillar.name)}
          variants={pillar.variants}
          tone="black"
        />
      )}

      <CandidacyChecklist
        index={next()}
        eyebrow={detail.criteriaEyebrow}
        title={detail.criteriaTitle}
        intro={detail.criteriaIntro}
        criteria={pillar.criteria}
        tone={pillar.variants ? "cream" : "black"}
      />

      <RequestSection
        index={next()}
        variant="pillar"
        context={{ label: detail.requestContextLabel, value: pillar.name }}
      />
    </>
  );
}
