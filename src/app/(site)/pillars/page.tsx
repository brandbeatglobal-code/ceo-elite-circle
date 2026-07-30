import { MediaSection } from "@/components/MediaSection";
import { PageHero } from "@/components/PageHero";
import { RequestSection } from "@/components/RequestSection";
import { pillars, pillarsContent } from "@/lib/pillars";
import { ordinal } from "@/lib/ordinal";

const { page } = pillarsContent;

export const metadata = { title: page.metaTitle };

export default function PillarsPage() {
  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        intro={page.heroIntro}
      />

      {pillars.map((pillar, i) => (
        <MediaSection
          key={pillar.slug}
          index={ordinal(i)}
          eyebrow={`${page.itemEyebrowPrefix} ${ordinal(i)}`}
          title={pillar.name}
          photo={pillar.photo}
          tone={i % 2 === 1 ? "black" : "cream"}
          flip={i % 2 === 1}
          link={{
            href: `/pillars/${pillar.slug}`,
            label: page.itemLinkLabel,
          }}
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
