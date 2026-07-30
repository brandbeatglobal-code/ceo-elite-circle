import type { Criterion } from "@/components/CandidacyChecklist";
import type { IconKey } from "@/components/Icons";
import type { Step } from "@/components/NumberedSteps";
import type { Photo } from "@/lib/images";
import data from "../../content/membership.json";

/**
 * SAMPLE COPY. Category descriptions say what each category involves; they
 * state no fee and no entitlement that reads as a term.
 *
 * The three categories live here and only here. The homepage teaser reads them
 * from this file rather than holding its own copy, so a teaser and its full
 * page cannot drift apart.
 */
export type Category = { name: string; body: string; photo: Photo };
export type Feature = { icon: IconKey; label: string; body: string };
export type FaqItem = { title: string; body: string };

export type MembershipContent = {
  metaTitle: string;
  hero: { eyebrow: string; title: string; intro: string };
  whoShouldJoin: {
    eyebrow: string;
    title: string;
    intro: string;
    criteria: Criterion[];
  };
  categories: {
    eyebrow: string;
    title: string;
    intro: string;
    rowLabel: string;
    rowLinkLabel: string;
    items: Category[];
  };
  benefits: {
    eyebrow: string;
    title: string;
    intro: string;
    features: Feature[];
  };
  journey: { eyebrow: string; title: string; intro: string; steps: Step[] };
  faq: { eyebrow: string; title: string; intro: string; items: FaqItem[] };
};

export const membership = data as MembershipContent;
