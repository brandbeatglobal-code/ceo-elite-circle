import type { Criterion } from "@/components/CandidacyChecklist";
import type { Step } from "@/components/NumberedSteps";
import type { Photo } from "@/lib/images";
import { photos } from "@/lib/images";

/**
 * SAMPLE COPY — see the note at the top of `pillars.ts`. Deliberately free of
 * dates, durations, venues, partner organisations and headcounts, all of which
 * a visitor could reasonably take as fact.
 */
export type Experience = {
  slug: string;
  name: string;
  photo: Photo;
  summary: string;
  intro: string;
  criteria: Criterion[];
  /** Every signature experience is attended, so each carries a lead-up. */
  steps: Step[];
};

const attend = (what: string): Step[] => [
  {
    title: "Confirm your place",
    body: `Places at ${what} are held for members and released in order of confirmation. Confirming early secures the seat rather than the date.`,
  },
  {
    title: "Submit your themes",
    body: "Members send the questions they want raised beforehand, so the programme is shaped by the room rather than presented to it.",
  },
  {
    title: "Arrive unhurried",
    body: "The most useful conversations tend to happen either side of the formal programme. Allow for them.",
  },
  {
    title: "Carry it forward",
    body: "Introductions made during the gathering are followed up by the Circle, so momentum is not left to chance.",
  },
];

export const experiences: Experience[] = [
  {
    slug: "ceo-leadership-summit",
    name: "CEO Leadership Summit",
    photo: { src: null, alt: "", note: "a summit stage or full room, shot wide." },
    summary: "The Circle's principal gathering of the year.",
    intro:
      "The one occasion on which the whole membership convenes. The programme is built from the questions members bring, and the value is as much in the margins as in the sessions themselves.",
    criteria: [
      {
        title: "Ready to be in the room",
        body: "The summit rewards presence. Members who attend fully take more from it than those who pass through.",
      },
      {
        title: "Carrying a live question",
        body: "The programme is assembled from what members are actually working on.",
      },
      {
        title: "Open to being introduced",
        body: "Introductions are made throughout, and are the part members most often remember.",
      },
      {
        title: "Willing to contribute from the floor",
        body: "Sessions are conversations. The audience is the panel.",
      },
    ],
    steps: attend("the summit"),
  },
  {
    slug: "chairmans-majlis",
    name: "Chairman's Majlis",
    photo: { src: null, alt: "", note: "a majlis setting — low seating, warm light." },
    summary: "An evening of open conversation, in the majlis tradition.",
    intro:
      "Held in the majlis tradition: seated in the round, no head of the table, and no agenda beyond the subject raised from the chair. Conversation moves where the room takes it.",
    criteria: [
      {
        title: "Comfortable without structure",
        body: "There is no running order. The evening finds its own shape.",
      },
      {
        title: "Content to listen",
        body: "The majlis works because not everyone speaks at once, and nobody is obliged to speak at all.",
      },
      {
        title: "Respectful of the form",
        body: "The tradition carries its own courtesies, and members are asked to observe them.",
      },
      {
        title: "Present in person",
        body: "The majlis is not held remotely. Attendance means being in the room.",
      },
    ],
    steps: attend("the majlis"),
  },
  {
    slug: "executive-leadership-retreat",
    name: "Executive Leadership Retreat",
    photo: { src: null, alt: "", note: "a retreat setting away from the city — landscape or lodge." },
    summary: "Time away from the office, and from the role.",
    intro:
      "A residential gathering held away from the working environment, where the distance is the point. Members arrive as themselves rather than as their title.",
    criteria: [
      {
        title: "Able to step away properly",
        body: "The retreat asks for uninterrupted attention, which is the hardest thing a chief executive can offer.",
      },
      {
        title: "Looking beyond the quarter",
        body: "Sessions are built for the questions that never reach the top of the agenda.",
      },
      {
        title: "Comfortable in a small group",
        body: "Numbers are kept low so that everybody is known by the end.",
      },
      {
        title: "Open to changing your mind",
        body: "Members tend to leave with a different question than the one they arrived with.",
      },
    ],
    steps: attend("the retreat"),
  },
  {
    slug: "future-leadership-forum",
    name: "Future Leadership Forum",
    photo: { src: null, alt: "", note: "a younger cohort in discussion." },
    summary: "For the generation preparing to take the chair.",
    intro:
      "Convened for senior leaders approaching the top role, and for the members preparing them. The forum exists to shorten the distance between readiness and appointment.",
    criteria: [
      {
        title: "Approaching the top role",
        body: "Built for those close enough to see the seat, and to feel the weight of it.",
      },
      {
        title: "Sponsored by a member",
        body: "Attendance comes through a member who knows the candidate's work directly.",
      },
      {
        title: "Willing to be candid about gaps",
        body: "The forum is most useful to those prepared to name what they do not yet know.",
      },
      {
        title: "Serious about the transition",
        body: "This is a working session, not a networking occasion.",
      },
    ],
    steps: attend("the forum"),
  },
  {
    slug: "ceo-excellence-awards",
    name: "CEO Excellence Awards",
    photo: { src: null, alt: "", note: "an awards evening — a room set formally, before or during." },
    summary: "Recognition decided by peers.",
    intro:
      "An evening given to recognising leadership as judged by those doing the same work. Recognition is decided within the membership rather than by submission or nomination volume.",
    criteria: [
      {
        title: "Judged by peers",
        body: "Recognition carries weight because of who is giving it, not how it was applied for.",
      },
      {
        title: "Nominated, not entered",
        body: "There is no submission process. Members put forward the work they have seen.",
      },
      {
        title: "Measured over time",
        body: "Consideration reflects a body of work rather than a single year's result.",
      },
      {
        title: "Received in company",
        body: "The evening is held among the membership, and is not a public occasion.",
      },
    ],
    steps: attend("the awards evening"),
  },
  {
    slug: "international-ceo-delegation",
    name: "International CEO Delegation",
    photo: { src: null, alt: "", note: "travel or arrival — an airport, a skyline on approach." },
    summary: "A delegation abroad, convened around a single market.",
    intro:
      "A small group travels together to one market, with a programme built around meeting the people who actually operate in it. The delegation is convened for understanding rather than for ceremony.",
    criteria: [
      {
        title: "Serious about the market",
        body: "Delegations are for members with a real interest in the destination, not a general curiosity.",
      },
      {
        title: "Able to travel with the group",
        body: "The delegation moves together. The conversations between meetings matter as much as the meetings.",
      },
      {
        title: "Prepared in advance",
        body: "Members read the briefing before departure so that time on the ground is not spent on background.",
      },
      {
        title: "Representing the Circle well",
        body: "Members travel as guests of the market they are visiting, and are asked to conduct themselves accordingly.",
      },
    ],
    steps: attend("a delegation"),
  },
  {
    slug: "ceo-private-dinners",
    name: "CEO Private Dinners",
    photo: photos.privateDinners,
    summary: "A small table, a single subject, no agenda beyond the conversation.",
    intro:
      "A private table convened around one subject, kept small enough that a single conversation can hold. There is no programme and no speaker — only the people at the table.",
    criteria: [
      {
        title: "At ease in a small room",
        body: "The table is kept small deliberately, so that nobody is a spectator.",
      },
      {
        title: "Interested in the subject",
        body: "Each dinner is convened around one question. Members come for that question.",
      },
      {
        title: "Discreet about what is said",
        body: "Nothing said at the table is repeated outside it.",
      },
      {
        title: "Willing to stay late",
        body: "The most useful part of the evening is rarely the first hour.",
      },
    ],
    steps: attend("a private dinner"),
  },
];

export function experienceBySlug(slug: string) {
  return experiences.find((e) => e.slug === slug);
}
