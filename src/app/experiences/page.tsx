import { MediaSection } from "@/components/MediaSection";
import { PageHero } from "@/components/PageHero";
import { RequestSection } from "@/components/RequestSection";
import { experiences, experiencesContent } from "@/lib/experiences";
import { ordinal } from "@/lib/ordinal";

const { page } = experiencesContent;

export const metadata = { title: page.metaTitle };

export default function ExperiencesPage() {
  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        intro={page.heroIntro}
      />

      {experiences.map((experience, i) => (
        <MediaSection
          key={experience.slug}
          index={ordinal(i)}
          eyebrow={page.itemEyebrow}
          title={experience.name}
          photo={experience.photo}
          tone={i % 2 === 1 ? "black" : "cream"}
          flip={i % 2 === 1}
          link={{
            href: `/experiences/${experience.slug}`,
            label: page.itemLinkLabel,
          }}
        >
          <p
            className={`type-lead ${
              i % 2 === 1 ? "text-white" : "text-ink"
            } max-w-md`}
          >
            {experience.summary}
          </p>
          <p
            className={`type-body ${
              i % 2 === 1 ? "text-white/70" : "text-olive"
            } max-w-md`}
          >
            {experience.intro}
          </p>
        </MediaSection>
      ))}

      <RequestSection index={ordinal(experiences.length)} />
    </>
  );
}
