import type { IconKey } from "@/components/Icons";
import type { Photo } from "@/lib/images";
import data from "../../content/about.json";

/**
 * SAMPLE COPY, with two deliberate exceptions.
 *
 * The **leadership cards are real** — three named people, their titles and a
 * line each, supplied by the Circle. Nothing in them is sample copy, so
 * nothing in them may be rewritten to suit the voice: every word is a factual
 * claim about a real person. Their photo slots are deliberately still empty,
 * which is the honest state until real headshots exist.
 *
 * The philosophy pull-quote carries only its note, and stays that way:
 * filling it means putting words in a named person's mouth.
 *
 * `sections` is read positionally: the first four render as Three–Six, the
 * philosophy pull-quote as Seven, and the fifth as Eight. That split is layout,
 * so a sixth entry here would not add a section.
 */
export type AboutSection = { title: string; lead: string; body: string };
export type Difference = { icon: IconKey; label: string; body: string };

export type AboutContent = {
  hero: {
    eyebrow: string;
    title: string;
    left: string;
    right: string;
    photo: Photo;
  };
  story: {
    eyebrow: string;
    title: string;
    lead: string;
    body: string;
    photo: Photo;
  };
  leadership: {
    eyebrow: string;
    title: string;
    intro: string;
    /**
     * Real, named people. Every field is required: a name beside an empty
     * title or description is the half-published person the placeholder era
     * existed to avoid, so there is no null to fall back to.
     */
    cards: {
      name: string;
      title: string;
      description: string;
      photo: Photo;
    }[];
  };
  sections: AboutSection[];
  philosophy: {
    eyebrow: string;
    title: string;
    /**
     * A real pull-quote, or null. Null renders the labelled pending frame
     * carrying `quoteNote`; a value renders as an actual quotation.
     *
     * These are two different fields on purpose. `quoteNote` is the sentence
     * shown *inside* the empty frame — a brief for whoever fills the slot —
     * and a real quote typed into it renders as a placeholder, dashed border
     * and all. That is exactly what happened once.
     */
    quote: string | null;
    /** Who said it. Null renders `attributionNote` beneath the quote. */
    quoteAttribution: string | null;
    quoteNote: string;
    attributionNote: string;
    support: string;
    photo: Photo;
  };
  differences: {
    eyebrow: string;
    title: string;
    intro: string;
    features: Difference[];
  };
};

export const about = data as AboutContent;
