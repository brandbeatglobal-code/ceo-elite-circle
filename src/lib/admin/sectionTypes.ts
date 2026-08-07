import crypto from "node:crypto";

/**
 * The section layouts a page can be given, and what a new one starts as.
 *
 * One place, read by the picker and by the validator, so a layout can never be
 * offered and then refused — the same discipline as `formSpec.ts` and
 * `admin/schema.ts`.
 *
 * **A new section starts genuinely empty.** No "Feature One / Feature Two", no
 * sample sentence, nothing that could be mistaken for copy someone else wrote
 * and left half-finished. Every field is an empty string, and the page renders
 * every empty field as the same labelled pending frame it uses everywhere
 * else — so a new section reads as a marked-out space, which is what it is.
 *
 * That is not a stylistic preference. This project has twice published invented
 * text as though it were real, and the whole guardrail elsewhere — the Trust
 * Framework having no field to draft into until the wording was signed off, the
 * testimonials staying blank for months — is the same rule: an empty slot is
 * honest, a plausible one is not. A starter template is a plausible one.
 *
 * The item counts are fixed at creation and match what the rest of the site
 * uses. Growing or shrinking them afterwards is a different job, deliberately
 * not in this phase.
 */
export type SectionTypeKey =
  | "prose"
  | "pending"
  | "variantCards"
  | "numberedSteps"
  | "featureGrid"
  | "candidacyChecklist";

export type SectionTypeSpec = {
  key: SectionTypeKey;
  /** What it is called in the picker. Never the internal key. */
  label: string;
  /** What it is for, in a sentence someone choosing can act on. */
  description: string;
  /** How many items it starts with, where it has items. */
  count?: number;
  /** A shape summary for the picker's second line. */
  shape: string;
};

export const SECTION_TYPES: SectionTypeSpec[] = [
  {
    key: "prose",
    label: "Prose",
    description:
      "A headline with two paragraphs beside it — a lead sentence and a longer one under it. The plainest section on the site; use it when there is something to say and nothing to list.",
    shape: "Headline, lead paragraph, body paragraph",
  },
  {
    key: "pending",
    label: "Reserved space",
    description:
      "A headline with a labelled note where the content will go. For a section the page needs to have but cannot fill yet — the way Expert Advisors waits for real names.",
    shape: "Headline and a note saying what is awaited",
  },
  {
    key: "variantCards",
    label: "Named variants",
    description:
      "Three named things side by side, each with a short description. No photographs and no prices. Used for the membership categories and the councils.",
    count: 3,
    shape: "Headline, intro, three named cards",
  },
  {
    key: "numberedSteps",
    label: "Numbered sequence",
    description:
      "Four steps in order, each with a title and a short paragraph, divided by hairlines. For a process or a shape of an occasion. Carries no dates.",
    count: 4,
    shape: "Headline, intro, four numbered steps",
  },
  {
    key: "featureGrid",
    label: "Feature grid",
    description:
      "Four cells across, each with a line-art mark over a short label and a sentence. For a set of things that are alike in kind — benefits, principles, differences.",
    count: 4,
    shape: "Headline, intro, four marked cells",
  },
  {
    key: "candidacyChecklist",
    label: "Who it is for",
    description:
      "A two-by-two grid answering who something suits, each square with its own mark. Used on the pillar and experience pages.",
    count: 4,
    shape: "Headline, intro, four criteria",
  },
];

export function sectionTypeSpec(key: string): SectionTypeSpec | null {
  return SECTION_TYPES.find((t) => t.key === key) ?? null;
}

/**
 * A short, permanent id for a section that does not have one yet.
 *
 * Random rather than derived: a derived id would collide the moment two
 * sections of the same type were added to the same page, and the whole value
 * of these is that they are unique and never reused.
 */
export function mintSectionId(): string {
  return crypto.randomBytes(4).toString("hex");
}

/** Every mark a blank section starts with is the Circle's own — chosen later. */
const DEFAULT_ICON = "rings";

/**
 * A brand-new section of the given type: right shape, no content.
 *
 * Every string is empty. Nothing here is a suggestion, a sample or a
 * placeholder sentence — the *rendering* supplies the labelled frames, from
 * the site's own empty-state components, so what an editor sees on the preview
 * is the page saying "this is not written yet" in the language it already uses
 * for that everywhere else.
 */
export function blankSection(key: SectionTypeKey): Record<string, unknown> {
  const base = { id: mintSectionId(), type: key, eyebrow: "", title: "" };
  switch (key) {
    case "prose":
      return { ...base, lead: "", body: "" };
    case "pending":
      return { ...base, note: "" };
    case "variantCards":
      return {
        ...base,
        intro: "",
        items: Array.from({ length: 3 }, () => ({ name: "", body: "" })),
      };
    case "numberedSteps":
      return {
        ...base,
        intro: "",
        steps: Array.from({ length: 4 }, () => ({ title: "", body: "" })),
      };
    case "featureGrid":
      return {
        ...base,
        intro: "",
        features: Array.from({ length: 4 }, () => ({
          icon: DEFAULT_ICON,
          label: "",
          body: "",
        })),
      };
    case "candidacyChecklist":
      return {
        ...base,
        intro: "",
        criteria: Array.from({ length: 4 }, () => ({
          icon: DEFAULT_ICON,
          title: "",
          body: "",
        })),
      };
  }
}
