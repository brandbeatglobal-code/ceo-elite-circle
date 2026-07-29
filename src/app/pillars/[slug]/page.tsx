import { notFound } from "next/navigation";
import { CandidacyChecklist } from "@/components/CandidacyChecklist";
import { DetailHero } from "@/components/DetailHero";
import { RequestSection } from "@/components/RequestSection";
import { Section } from "@/components/Section";
import { VariantCards } from "@/components/VariantCards";
import { pillarBySlug, pillars } from "@/lib/pillars";
import { ordinal } from "@/lib/ordinal";

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
  return { title: pillar ? `${pillar.name} — CEO Elite Circle` : "CEO Elite Circle" };
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pillar = pillarBySlug(slug);
  if (!pillar) notFound();

  // Sections are numbered in the order they actually render, so a pillar
  // without the variants section still runs One, Two, Three.
  let n = 0;
  const next = () => ordinal(n++);

  return (
    <>
      <DetailHero eyebrow="Pillar" title={pillar.name} photo={pillar.photo} />

      <Section index={next()} eyebrow="About" title={pillar.name} />

      {pillar.variants && (
        <VariantCards
          index={next()}
          eyebrow="Formats"
          title="How it is offered"
          tone="black"
        />
      )}

      <CandidacyChecklist
        index={next()}
        eyebrow="Who it is for"
        title="Who this pillar serves"
        tone={pillar.variants ? "cream" : "black"}
      />

      <RequestSection index={next()} />
    </>
  );
}
