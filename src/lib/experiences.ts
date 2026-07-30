import type { Criterion } from "@/components/CandidacyChecklist";
import type { Step } from "@/components/NumberedSteps";
import type { Photo } from "@/lib/images";
import data from "../../content/experiences.json";

/**
 * SAMPLE COPY — see the note in `pillars.ts`. Deliberately free of dates,
 * durations, venues, partner organisations and headcounts, all of which a
 * visitor could reasonably take as fact.
 *
 * `steps` used to be generated: one four-step template with the occasion's
 * noun interpolated. They are written out per experience now, so editing the
 * summit's lead-up cannot silently rewrite the awards evening's.
 */
export type Experience = {
  slug: string;
  name: string;
  photo: Photo;
  summary: string;
  intro: string;
  criteria: Criterion[];
  /** Every signature experience is attended, so each carries a lead-up. */
  steps: Step[];
};

export type ExperiencesContent = {
  page: {
    metaTitle: string;
    heroEyebrow: string;
    heroTitle: string;
    heroIntro: string;
    itemEyebrow: string;
    itemLinkLabel: string;
  };
  detail: {
    fallbackMetaTitle: string;
    heroEyebrow: string;
    aboutEyebrow: string;
    criteriaEyebrow: string;
    criteriaTitle: string;
    criteriaIntro: string;
    stepsEyebrow: string;
    stepsTitle: string;
    stepsIntro: string;
    requestContextLabel: string;
  };
  items: Experience[];
};

// `as`, like the other loaders carrying an `IconKey`: TypeScript widens
// the JSON's icon strings to `string`, which no literal union accepts.
export const experiencesContent = data as ExperiencesContent;
export const experiences = experiencesContent.items;

export function experienceBySlug(slug: string) {
  return experiences.find((e) => e.slug === slug);
}
