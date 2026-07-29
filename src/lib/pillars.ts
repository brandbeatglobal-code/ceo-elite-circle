import type { Criterion } from "@/components/CandidacyChecklist";
import type { Variant } from "@/components/VariantCards";
import type { Photo } from "@/lib/images";

/**
 * SAMPLE COPY. Every description, criterion and variant below is design-stage
 * writing in the Circle's voice, to be reviewed and replaced. It carries no
 * verifiable claim — no names, figures, dates, fees or partner organisations —
 * so nothing here can be relied on as fact if a visitor reads it early.
 */
export type Pillar = {
  slug: string;
  name: string;
  photo: Photo;
  summary: string;
  intro: string;
  criteria: Criterion[];
  /**
   * Named formats, only where they plausibly exist. Chosen per item rather
   * than stamped across the set — Elite Network and Knowledge & Insights have
   * no meaningful list of variants, so they carry none.
   */
  variants?: Variant[];
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
    summary: "Considered counsel on the decisions that carry weight.",
    intro:
      "Members bring live questions to a small group of peers who have stood on comparable ground. The purpose is not to be handed a prescription, but to leave with a clearer view of the trade-offs and the confidence to choose.",
    criteria: [
      {
        title: "Facing a decision without precedent",
        body: "The questions that reach a chief executive rarely arrive with a template. Advisory exists for the ones that do not.",
      },
      {
        title: "Holding the final call alone",
        body: "Counsel is most useful where accountability cannot be delegated, and where the decision will be yours regardless.",
      },
      {
        title: "Wanting challenge, not agreement",
        body: "Members ask to be tested. The value lies in the objection you had not yet considered.",
      },
      {
        title: "Prepared to offer the same in return",
        body: "Every member sits on both sides of the table across a year. The counsel you receive is the counsel you give.",
      },
    ],
    variants: [
      {
        name: "Private Counsel",
        body: "A confidential session with a handful of peers chosen for direct relevance to the question at hand.",
      },
      {
        name: "Standing Advisory",
        body: "A consistent group meeting through the year, so context carries forward rather than being rebuilt each time.",
      },
      {
        name: "Rapid Consultation",
        body: "A short, quickly convened conversation for decisions that will not wait for the calendar.",
      },
    ],
  },
  {
    slug: "elite-network",
    name: "Elite Network",
    photo: {
      src: null,
      alt: "",
      note: "a room of people mid-conversation, shot wide.",
    },
    summary: "Introductions made with intent.",
    intro:
      "The Circle connects members deliberately and sparingly. A directory invites volume; the Circle is built on the view that one well-judged introduction is worth more than a long list of contacts.",
    criteria: [
      {
        title: "Selective by preference",
        body: "Members who measure a network by the quality of its relationships rather than its size.",
      },
      {
        title: "Prepared to be introduced",
        body: "Introductions run in both directions, and are made only where both parties stand to gain.",
      },
      {
        title: "Discreet by instinct",
        body: "What is said in a first conversation stays in it. Discretion is assumed, not requested.",
      },
      {
        title: "Long in outlook",
        body: "Relationships within the Circle are measured in years, and are expected to outlast any single transaction.",
      },
    ],
  },
  {
    slug: "executive-forums",
    name: "Executive Forums",
    photo: {
      src: null,
      alt: "",
      note: "a forum in session — seated circle or roundtable.",
    },
    summary: "Closed sessions, held in confidence, on one question at a time.",
    intro:
      "A small group works through a single question in depth. There is no audience, no record and no performance — only the conversation that becomes possible once nobody is presenting.",
    criteria: [
      {
        title: "Willing to speak plainly",
        body: "Forums depend on candour. Members bring the version of the problem they would not put in a board pack.",
      },
      {
        title: "Comfortable without an answer",
        body: "Some sessions close without resolution. The clarity is in the framing as often as in the conclusion.",
      },
      {
        title: "Able to hold confidence",
        body: "Nothing said in a forum leaves it, including the fact of what was discussed.",
      },
      {
        title: "Present for the whole session",
        body: "Forums are attended in full. Partial attendance changes the room for everyone in it.",
      },
    ],
    variants: [
      {
        name: "Peer Forum",
        body: "Members of comparable scale and stage, working through a question none of them has resolved.",
      },
      {
        name: "Sector Forum",
        body: "A group drawn from one industry, where shared context removes the need for preamble.",
      },
      {
        name: "Chairman's Forum",
        body: "Convened around a question raised from the chair, with attendance by invitation.",
      },
    ],
  },
  {
    slug: "knowledge-insights",
    name: "Knowledge & Insights",
    photo: {
      src: null,
      alt: "",
      note: "a quiet study or reading setting. Considered, unhurried.",
    },
    summary: "Briefings written for people who already know their sector.",
    intro:
      "Analysis prepared to be read quickly and used immediately. The Circle publishes less than it could, on the principle that a member's attention is the scarcest thing in the room.",
    criteria: [
      {
        title: "Reading for decisions, not for interest",
        body: "Every briefing is written to be useful in a room, not to be admired in the abstract.",
      },
      {
        title: "Already fluent in your field",
        body: "Nothing is explained from first principles. Members are assumed to know their own sector well.",
      },
      {
        title: "Short of time, not of judgement",
        body: "Material is written to be read in the gaps between other obligations.",
      },
      {
        title: "Willing to contribute",
        body: "Members write as well as read. The strongest material comes from the people living the problem.",
      },
    ],
  },
  {
    slug: "executive-councils",
    name: "Executive Councils",
    photo: {
      src: null,
      alt: "",
      note: "a formal council table, empty or mid-session.",
    },
    summary: "Standing groups that meet through the year, so context accumulates.",
    intro:
      "Councils are organised around a shared discipline or region and hold their membership across the year. The work compounds: each meeting begins where the last one ended rather than starting again.",
    criteria: [
      {
        title: "Able to commit across a year",
        body: "Councils depend on continuity. A member who attends once changes the group less than one who stays.",
      },
      {
        title: "Working within a shared discipline",
        body: "Each council forms around a common field, so the conversation can start well past the basics.",
      },
      {
        title: "Prepared to carry work between sessions",
        body: "Progress happens in the intervals as much as in the room.",
      },
      {
        title: "Content to build slowly",
        body: "Councils are not convened to produce a result by a deadline. They are convened to think properly.",
      },
    ],
    variants: [
      {
        name: "Sector Councils",
        body: "Organised by industry, for questions that only make sense with shared commercial context.",
      },
      {
        name: "Regional Councils",
        body: "Organised by geography, where the operating environment is the common ground.",
      },
      {
        name: "Practice Councils",
        body: "Organised by function, drawing members who hold the same remit across different industries.",
      },
    ],
  },
];

export function pillarBySlug(slug: string) {
  return pillars.find((p) => p.slug === slug);
}
