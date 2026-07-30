import type { Photo } from "@/lib/images";
import data from "../../content/homepage.json";

/**
 * The homepage's own copy. Everything it teases — pillars, experiences,
 * membership categories — is read from that section's own content file, so no
 * teaser can drift from the page it points at.
 *
 * `hero.headline` is an array because the line breaks are deliberate: the
 * third line is indented at `lg`, which only works if it is its own line.
 */
export type HomeContent = {
  hero: {
    photo: Photo;
    headline: string[];
    lead: string;
    body: string;
    cta: string;
  };
  philosophy: {
    eyebrow: string;
    headerLinkLabel: string;
    title: string;
    lead: string;
    body: string;
    linkLabel: string;
  };
  pillars: {
    eyebrow: string;
    headerLinkLabel: string;
    title: string;
    lead: string;
    cardLabel: string;
    cardLinkLabel: string;
  };
  whyNow: {
    eyebrow: string;
    title: string;
    lead: string;
    body: string;
    linkLabel: string;
    photo: Photo;
  };
  categories: {
    eyebrow: string;
    headerLinkLabel: string;
    title: string;
    rowLabel: string;
    rowLinkLabel: string;
  };
  governance: {
    eyebrow: string;
    headerLinkLabel: string;
    title: string;
    lead: string;
    body: string;
    primaryLinkLabel: string;
    secondaryLinkLabel: string;
  };
  experiences: {
    eyebrow: string;
    headerLinkLabel: string;
    title: string;
    lead: string;
    /** Which experience gets the photograph rather than a row in the list. */
    featuredSlug: string;
    featuredLinkLabel: string;
    listLinkLabel: string;
  };
  testimonials: {
    eyebrow: string;
    title: string;
    note: string;
    cardLabel: string;
  };
};

export const home: HomeContent = data;
