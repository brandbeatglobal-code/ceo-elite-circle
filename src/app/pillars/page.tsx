import { MediaSection } from "@/components/MediaSection";
import { PageHero } from "@/components/PageHero";
import { RequestSection } from "@/components/RequestSection";
import { pillars } from "@/lib/pillars";
import { ordinal } from "@/lib/ordinal";

export const metadata = { title: "The Five Pillars — CEO Elite Circle" };

export default function PillarsPage() {
  return (
    <>
      <PageHero
        eyebrow="Structure"
        title="The Five Pillars"
        intro="Five pillars carry the work of the Circle. Each stands on its own, and each is available to every member."
      />

      {pillars.map((pillar, i) => (
        <MediaSection
          key={pillar.slug}
          index={ordinal(i)}
          eyebrow={`Pillar ${ordinal(i)}`}
          title={pillar.name}
          photo={pillar.photo}
          tone={i % 2 === 1 ? "black" : "cream"}
          flip={i % 2 === 1}
          link={{ href: `/pillars/${pillar.slug}`, label: "Discover the Circle" }}
        >
          <p
            className={`type-lead ${
              i % 2 === 1 ? "text-white" : "text-ink"
            } max-w-md`}
          >
            {pillar.summary}
          </p>
          <p
            className={`type-body ${
              i % 2 === 1 ? "text-white/70" : "text-olive"
            } max-w-md`}
          >
            {pillar.intro}
          </p>
        </MediaSection>
      ))}

      <RequestSection index={ordinal(pillars.length)} />
    </>
  );
}
