import type { Photo } from "@/lib/images";

export type Pillar = {
  slug: string;
  name: string;
  photo: Photo;
  /**
   * Optional patterns this pillar actually warrants. Chosen per item rather
   * than stamped across the set — "Elite Network" has no meaningful list of
   * named formats the way the advisory and forum work does. Revisit these once
   * real content exists; the structure should follow the content, not lead it.
   */
  variants: boolean;
};

export const pillars: Pillar[] = [
  {
    slug: "strategic-advisory",
    name: "Strategic Advisory",
    photo: {
      src: null,
      alt: "",
      note: "a working advisory session — two or three people, close in.",
    },
    variants: true,
  },
  {
    slug: "elite-network",
    name: "Elite Network",
    photo: {
      src: null,
      alt: "",
      note: "a room of people mid-conversation, shot wide.",
    },
    variants: false,
  },
  {
    slug: "executive-forums",
    name: "Executive Forums",
    photo: {
      src: null,
      alt: "",
      note: "a forum in session — seated circle or roundtable.",
    },
    variants: true,
  },
  {
    slug: "knowledge-insights",
    name: "Knowledge & Insights",
    photo: {
      src: null,
      alt: "",
      note: "a quiet study or reading setting. Considered, unhurried.",
    },
    variants: false,
  },
  {
    slug: "executive-councils",
    name: "Executive Councils",
    photo: {
      src: null,
      alt: "",
      note: "a formal council table, empty or mid-session.",
    },
    variants: true,
  },
];

export function pillarBySlug(slug: string) {
  return pillars.find((p) => p.slug === slug);
}
