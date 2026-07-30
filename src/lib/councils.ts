import type { IconKey } from "@/components/Icons";
import type { Step } from "@/components/NumberedSteps";
import type { Variant } from "@/components/VariantCards";
import data from "../../content/councils.json";

/**
 * SAMPLE COPY, except Expert Advisors: that section names real individuals, so
 * it carries a placeholder note and no content field to fill.
 */
export type Feature = { icon: IconKey; label: string; body: string };

export type CouncilsContent = {
  metaTitle: string;
  hero: { eyebrow: string; title: string; intro: string };
  purpose: { eyebrow: string; title: string; lead: string; body: string };
  councils: {
    eyebrow: string;
    title: string;
    intro: string;
    items: Variant[];
  };
  format: { eyebrow: string; title: string; intro: string; steps: Step[] };
  benefits: {
    eyebrow: string;
    title: string;
    intro: string;
    features: Feature[];
  };
  calendar: { eyebrow: string; title: string; intro: string; steps: Step[] };
  advisors: { eyebrow: string; title: string; placeholderNote: string };
};

export const councils = data as CouncilsContent;
