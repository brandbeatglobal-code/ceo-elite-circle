import type { IconKey } from "@/components/Icons";
import type { Photo } from "@/lib/images";
import data from "../../content/about.json";

/**
 * SAMPLE COPY, with two deliberate exceptions that must stay empty: the four
 * leadership cards carry a photo slot and nothing else, and the philosophy
 * pull-quote carries only its note. Filling either means naming a real person.
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
    cards: { photo: Photo }[];
  };
  sections: AboutSection[];
  philosophy: {
    eyebrow: string;
    title: string;
    quoteNote: string;
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
