import type { Criterion } from "@/components/CandidacyChecklist";
import type { Variant } from "@/components/VariantCards";
import type { Photo } from "@/lib/images";
import data from "../../content/pillars.json";

/**
 * SAMPLE COPY lives in `content/pillars.json`. Every description, criterion and
 * variant there is design-stage writing in the Circle's voice, to be reviewed
 * and replaced. It carries no verifiable claim — no names, figures, dates, fees
 * or partner organisations — so nothing can be relied on as fact if a visitor
 * reads it early.
 */
export type Pillar = {
  slug: string;
  name: string;
  photo: Photo;
  summary: string;
  intro: string;
  criteria: Criterion[];
  /**
   * Named formats, only where they plausibly exist. Chosen per item rather
   * than stamped across the set — Elite Network and Knowledge & Insights carry
   * `null`, which also removes a section and so shifts that page's running
   * index. The detail page's local counter handles it.
   */
  variants: Variant[] | null;
};

export type PillarsContent = {
  page: {
    metaTitle: string;
    heroEyebrow: string;
    heroTitle: string;
    heroIntro: string;
    itemEyebrowPrefix: string;
    itemLinkLabel: string;
  };
  detail: {
    fallbackMetaTitle: string;
    heroEyebrow: string;
    aboutEyebrow: string;
    variantsEyebrow: string;
    variantsTitle: string;
    /** Carries a `{name}` token, resolved against the pillar at render. */
    variantsIntro: string;
    criteriaEyebrow: string;
    criteriaTitle: string;
    criteriaIntro: string;
    requestContextLabel: string;
  };
  items: Pillar[];
};

// `as`, like the other loaders carrying an `IconKey`: TypeScript widens
// the JSON's icon strings to `string`, which no literal union accepts.
export const pillarsContent = data as PillarsContent;
export const pillars = pillarsContent.items;

export function pillarBySlug(slug: string) {
  return pillars.find((p) => p.slug === slug);
}
