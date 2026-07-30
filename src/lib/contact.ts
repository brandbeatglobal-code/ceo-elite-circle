import type { Step } from "@/components/NumberedSteps";
import data from "../../content/contact.json";

/**
 * SAMPLE COPY. Deliberately free of durations and dates — how long
 * consideration takes is a commitment, not a description.
 *
 * `/contact` is the only page with no `RequestSection`, because its own form is
 * the real one rather than a teaser of itself. So its form copy lives here
 * rather than in `content/forms.json`.
 */
export type ContactContent = {
  metaTitle: string;
  hero: { eyebrow: string; title: string; intro: string };
  form: {
    eyebrow: string;
    contactLegend: string;
    contactFields: string[];
    detailsLegend: string;
    detailsFields: string[];
    consentLabel: string;
    cta: string;
    note: string;
  };
  selection: { eyebrow: string; title: string; intro: string; steps: Step[] };
};

export const contact: ContactContent = data;
