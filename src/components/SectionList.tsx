import { Fragment } from "react";
import { CandidacyChecklist } from "@/components/CandidacyChecklist";
import { FeatureGrid } from "@/components/FeatureGrid";
import { Icon, type IconKey } from "@/components/Icons";
import { NumberedSteps } from "@/components/NumberedSteps";
import { Section } from "@/components/Section";
import { VariantCards } from "@/components/VariantCards";
import { Placeholder, type Tone } from "@/components/ui";
import type { Criterion } from "@/components/CandidacyChecklist";
import type { Step } from "@/components/NumberedSteps";
import type { Variant } from "@/components/VariantCards";
import { ordinal } from "@/lib/ordinal";

/**
 * A page's body sections, as data.
 *
 * The list a page renders between its hero and its closing form lives in
 * `content/*.json` as an array of these, rather than being written out by hand
 * in the page component. Reordering the array reorders the page; that is the
 * whole point, and it is what the admin will eventually drive.
 *
 * **Two things are deliberately absent from `PageSection`, and their absence is
 * the guardrail rather than a rule the interface is trusted to follow.**
 *
 * 1. **There is no `requestSection` member of this union.** The closing form is
 *    appended by the page component, after whatever this renders, so it cannot
 *    be represented as an entry here at all — not deletable, not reorderable,
 *    not expressible. A rule that says "don't move the form" can be broken by
 *    the next person to write a form; a union that cannot describe it cannot.
 *
 * 2. **There is no `number` and no `tone` field.** Both are computed here from
 *    array position — `ordinal(i)` and the parity of `i`. Storing either would
 *    let it drift out of step with where the section actually sits, which is
 *    precisely what reordering would cause: a section that says "Three" while
 *    sitting fourth, or two cream sections adjacent because both remembered
 *    being first. Derivation is what makes a reorder safe.
 */
type WithId = {
  /**
   * Short, permanent, and never regenerated.
   *
   * Minted once when a section is created and untouched by anything after —
   * reordering, editing its copy, even changing its type. It is not content
   * and is never shown as a field to fill in; it exists so a structural change
   * can be *described* rather than merely diffed. Without it, swapping two
   * sections reads as six positions changing; with it, it reads as two
   * sections swapping, which is what actually happened.
   */
  id: string;
};

export type PageSection = WithId &
  (
  /** Two-column prose: sans headline, a serif lead and a body paragraph. */
  | { type: "prose"; eyebrow: string; title: string; lead: string; body: string }
  /** Two-column prose whose right column is a labelled pending frame. */
  | { type: "pending"; eyebrow: string; title: string; note: string }
  /** Named variants, no photographs, no prices. */
  | {
      type: "variantCards";
      eyebrow: string;
      title: string;
      intro: string;
      items: Variant[];
    }
  /** Hairline-divided numbered sequence. No dates. */
  | {
      type: "numberedSteps";
      eyebrow: string;
      title: string;
      intro: string;
      steps: Step[];
    }
  /** Icon-and-text grid: a mark over a label and a short body. */
  | {
      type: "featureGrid";
      eyebrow: string;
      title: string;
      intro: string;
      features: { icon: IconKey; label: string; body: string }[];
    }
  /** The 2x2 "who this is for" grid. Each criterion names its own mark. */
  | {
      type: "candidacyChecklist";
      eyebrow: string;
      title: string;
      intro: string;
      criteria: Criterion[];
    });

/**
 * The background a section gets, from where it sits and nothing else.
 *
 * Cream, black, cream, black — starting cream, because every page opens on a
 * cream hero and the first body section reads as a continuation of it.
 */
/**
 * The eyebrow a section shows before it has been given one.
 *
 * A structural label rather than copy — the same category as the "Article
 * pending" cards on `/insights`. It is in code and not in `content/` on
 * purpose: it belongs to a section that has no content yet, so there is
 * nothing in the content file for it to be a field of.
 */
export const SECTION_PENDING_EYEBROW = "Section pending";

export function sectionTone(index: number): Tone {
  return index % 2 === 1 ? "black" : "cream";
}

/**
 * Is this field empty?
 *
 * A section added through the admin starts with every string empty, and an
 * empty string must render as the page's own pending frame rather than as
 * nothing at all — an empty `<h2>` is a hole, a labelled frame is a marked-out
 * space. So blankness is decided here, once, and the components below are
 * handed either real content or the placeholder that stands for its absence.
 */
const blank = (s: string | undefined | null): boolean => !s || !s.trim();

/** An item whose every text field is blank is an item nobody has written yet. */
function liveItems<T extends Record<string, unknown>>(
  items: T[],
  fields: (keyof T)[],
): (T | null)[] {
  return items.map((item) =>
    fields.every((f) => blank(item[f] as string)) ? null : item,
  );
}

/** One section, told only where it is. */
function renderSection(section: PageSection, index: number) {
  const tone = sectionTone(index);
  const idx = ordinal(index);
  // A section with no headline yet keeps its number and its eyebrow slot and
  // shows a frame where the headline will go.
  const heading = (title: string) =>
    blank(title) ? <Placeholder tone={tone} lead /> : title;
  const eyebrowOf = (e: string) => (blank(e) ? SECTION_PENDING_EYEBROW : e);
  const introOf = (i: string) => (blank(i) ? undefined : i);

  switch (section.type) {
    case "prose":
      return (
        <Section
          index={idx}
          eyebrow={eyebrowOf(section.eyebrow)}
          title={heading(section.title)}
          tone={tone}
        >
          {blank(section.lead) ? (
            <Placeholder tone={tone} lead />
          ) : (
            <p className={`type-lead ${tone === "cream" ? "text-ink" : "text-white"}`}>
              {section.lead}
            </p>
          )}
          {blank(section.body) ? (
            <Placeholder tone={tone} />
          ) : (
            <p className={`type-body ${tone === "cream" ? "text-olive" : "text-white/70"}`}>
              {section.body}
            </p>
          )}
        </Section>
      );

    case "pending":
      return (
        <Section
          index={idx}
          eyebrow={eyebrowOf(section.eyebrow)}
          title={heading(section.title)}
          tone={tone}
        >
          <Placeholder
            tone={tone}
            note={blank(section.note) ? undefined : section.note}
          />
        </Section>
      );

    case "variantCards":
      return (
        <VariantCards
          index={idx}
          eyebrow={eyebrowOf(section.eyebrow)}
          title={heading(section.title)}
          intro={introOf(section.intro)}
          variants={liveItems(section.items, ["name", "body"])}
          tone={tone}
        />
      );

    case "numberedSteps":
      return (
        <NumberedSteps
          index={idx}
          eyebrow={eyebrowOf(section.eyebrow)}
          title={heading(section.title)}
          intro={introOf(section.intro)}
          steps={liveItems(section.steps, ["title", "body"])}
          tone={tone}
        />
      );

    case "featureGrid":
      return (
        <FeatureGrid
          index={idx}
          eyebrow={eyebrowOf(section.eyebrow)}
          title={heading(section.title)}
          tone={tone}
          intro={
            blank(section.intro) ? (
              <Placeholder tone={tone} lead />
            ) : (
              <p
                className={`type-lead ${
                  tone === "cream" ? "text-ink" : "text-white"
                } max-w-lg`}
              >
                {section.intro}
              </p>
            )
          }
          features={liveItems(section.features, ["label", "body"]).map((f) =>
            f
              ? {
                  icon: <Icon name={f.icon} className="w-full h-full" />,
                  label: f.label,
                  body: f.body,
                }
              : null,
          )}
        />
      );

    case "candidacyChecklist":
      return (
        <CandidacyChecklist
          index={idx}
          eyebrow={eyebrowOf(section.eyebrow)}
          title={heading(section.title)}
          intro={introOf(section.intro)}
          criteria={liveItems(section.criteria, ["title", "body"])}
          tone={tone}
        />
      );
  }
}

/**
 * Renders a page's body sections in order.
 *
 * Takes the array and nothing else: a section is handed its position and works
 * the rest out from there. The page component is responsible for the hero
 * before this and the closing form after it, and `sections.length` is the
 * index that form takes — so the numbering stays contiguous through the end of
 * the page however the array changes.
 */
export function SectionList({ sections }: { sections: PageSection[] }) {
  return (
    <>
      {sections.map((section, i) => (
        // Keyed by the section's own id rather than its position, so React
        // moves a reordered section rather than rebuilding two of them.
        // A keyed Fragment, never a wrapper element: every section component
        // renders its own full-bleed <section>, and an extra div around it
        // would sit between that and <main>.
        <Fragment key={section.id}>{renderSection(section, i)}</Fragment>
      ))}
    </>
  );
}
