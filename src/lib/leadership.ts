import type { Photo } from "@/lib/images";
import data from "../../content/leadership.json";

/**
 * Leadership member records.
 *
 * Every text field is nullable and every entry is currently null, because there
 * are no real people yet. The template renders the labelled placeholder in each
 * empty slot, so the page works when visited directly and is ready the moment a
 * real person exists.
 *
 * Adding a real member means filling `name`, `credentials`, `role`, the
 * timeline and the quote together — a real portrait or a real name beside
 * placeholder text would read as a half-published person. Only once an entry is
 * complete should the About page's Leadership cards link to it.
 */
export type CvEntry = { period: string; title: string };

export type LeadershipMember = {
  slug: string;
  photo: Photo;
  name: string | null;
  credentials: string | null;
  role: string | null;
  intro: string | null;
  /** Alternating CV timeline rows. Empty renders placeholder rows. */
  timeline: CvEntry[];
  /** Accordion of expertise areas. Empty renders placeholder rows. */
  expertise: { title: string; body: string }[];
  quote: { words: string; attribution: string } | null;
};

export type LeadershipContent = {
  detail: {
    fallbackMetaTitle: string;
    heroEyebrow: string;
    expertiseEyebrow: string;
    expertiseTitle: string;
    expertisePlaceholderPrefix: string;
    careerEyebrow: string;
    careerTitle: string;
    careerPeriodLabel: string;
    recognitionEyebrow: string;
    recognitionTitle: string;
    recognitionPlaceholderPrefix: string;
    philosophyEyebrow: string;
    quoteNote: string;
  };
  members: LeadershipMember[];
};

export const leadershipContent: LeadershipContent = data;
export const leadership = leadershipContent.members;

export function memberBySlug(slug: string) {
  return leadership.find((m) => m.slug === slug);
}
