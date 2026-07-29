import type { Photo } from "@/lib/images";
import { photos } from "@/lib/images";

export type Experience = {
  slug: string;
  name: string;
  photo: Photo;
  /**
   * Every signature experience is something a member attends, so all of them
   * carry a lead-up worth setting out. Pillars do not — see `pillars.ts`.
   */
  steps: boolean;
};

export const experiences: Experience[] = [
  {
    slug: "ceo-leadership-summit",
    name: "CEO Leadership Summit",
    photo: {
      src: null,
      alt: "",
      note: "a summit stage or full room, shot wide.",
    },
    steps: true,
  },
  {
    slug: "chairmans-majlis",
    name: "Chairman's Majlis",
    photo: {
      src: null,
      alt: "",
      note: "a majlis setting — low seating, warm light.",
    },
    steps: true,
  },
  {
    slug: "executive-leadership-retreat",
    name: "Executive Leadership Retreat",
    photo: {
      src: null,
      alt: "",
      note: "a retreat setting away from the city. Landscape or lodge.",
    },
    steps: true,
  },
  {
    slug: "future-leadership-forum",
    name: "Future Leadership Forum",
    photo: {
      src: null,
      alt: "",
      note: "a younger cohort in discussion.",
    },
    steps: true,
  },
  {
    slug: "ceo-excellence-awards",
    name: "CEO Excellence Awards",
    photo: {
      src: null,
      alt: "",
      note: "an awards evening — room set formally, before or during.",
    },
    steps: true,
  },
  {
    slug: "international-ceo-delegation",
    name: "International CEO Delegation",
    photo: {
      src: null,
      alt: "",
      note: "travel or arrival — an airport, a skyline on approach.",
    },
    steps: true,
  },
  {
    slug: "ceo-private-dinners",
    name: "CEO Private Dinners",
    photo: photos.privateDinners,
    steps: true,
  },
];

export function experienceBySlug(slug: string) {
  return experiences.find((e) => e.slug === slug);
}
