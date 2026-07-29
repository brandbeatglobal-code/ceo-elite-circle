import { MediaSection } from "@/components/MediaSection";
import { PageHero } from "@/components/PageHero";
import { RequestSection } from "@/components/RequestSection";
import { experiences } from "@/lib/experiences";
import { ordinal } from "@/lib/ordinal";

export const metadata = { title: "Signature Experiences — CEO Elite Circle" };

export default function ExperiencesPage() {
  return (
    <>
      <PageHero
        eyebrow="Signature Experiences"
        title="Signature Experiences"
        intro="The occasions on which the Circle convenes. Each is built for a different kind of conversation."
      />

      {experiences.map((experience, i) => (
        <MediaSection
          key={experience.slug}
          index={ordinal(i)}
          eyebrow="Experience"
          title={experience.name}
          photo={experience.photo}
          tone={i % 2 === 1 ? "black" : "cream"}
          flip={i % 2 === 1}
          link={{
            href: `/experiences/${experience.slug}`,
            label: "Discover the Circle",
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
