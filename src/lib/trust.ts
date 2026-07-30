import data from "../../content/trust.json";

/**
 * NO SAMPLE COPY. `content/trust.json` holds ten area **names** and the
 * labelled placeholder that stands in for each one's wording — and must go on
 * holding nothing more until the wording is signed off.
 *
 * Each area is a commitment a prospective member could rely on, so draft text
 * reads as binding whether or not it is finished. There is deliberately no
 * `body` field on an area: the schema itself makes the rule hard to break by
 * accident, including from the admin panel.
 */
export type TrustContent = {
  metaTitle: string;
  hero: { eyebrow: string; title: string; intro: string };
  status: { eyebrow: string; title: string; lead: string; body: string };
  areas: {
    eyebrow: string;
    title: string;
    label: string;
    body: string;
    placeholderNote: string;
    items: string[];
  };
};

export const trust: TrustContent = data;
