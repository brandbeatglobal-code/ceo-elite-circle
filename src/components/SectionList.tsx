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
export type PageSection =
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
    };

/**
 * The background a section gets, from where it sits and nothing else.
 *
 * Cream, black, cream, black — starting cream, because every page opens on a
 * cream hero and the first body section reads as a continuation of it.
 */
export function sectionTone(index: number): Tone {
  return index % 2 === 1 ? "black" : "cream";
}

/** One section, told only where it is. */
function renderSection(section: PageSection, index: number) {
  const tone = sectionTone(index);
  const idx = ordinal(index);

  switch (section.type) {
    case "prose":
      return (
        <Section
          index={idx}
          eyebrow={section.eyebrow}
          title={section.title}
          tone={tone}
        >
          <p className={`type-lead ${tone === "cream" ? "text-ink" : "text-white"}`}>
            {section.lead}
          </p>
          <p className={`type-body ${tone === "cream" ? "text-olive" : "text-white/70"}`}>
            {section.body}
          </p>
        </Section>
      );

    case "pending":
      return (
        <Section
          index={idx}
          eyebrow={section.eyebrow}
          title={section.title}
          tone={tone}
        >
          <Placeholder tone={tone} note={section.note} />
        </Section>
      );

    case "variantCards":
      return (
        <VariantCards
          index={idx}
          eyebrow={section.eyebrow}
          title={section.title}
          intro={section.intro}
          variants={section.items}
          tone={tone}
        />
      );

    case "numberedSteps":
      return (
        <NumberedSteps
          index={idx}
          eyebrow={section.eyebrow}
          title={section.title}
          intro={section.intro}
          steps={section.steps}
          tone={tone}
        />
      );

    case "featureGrid":
      return (
        <FeatureGrid
          index={idx}
          eyebrow={section.eyebrow}
          title={section.title}
          tone={tone}
          intro={
            <p
              className={`type-lead ${
                tone === "cream" ? "text-ink" : "text-white"
              } max-w-lg`}
            >
              {section.intro}
            </p>
          }
          features={section.features.map((f) => ({
            icon: <Icon name={f.icon} className="w-full h-full" />,
            label: f.label,
            body: f.body,
          }))}
        />
      );

    case "candidacyChecklist":
      return (
        <CandidacyChecklist
          index={idx}
          eyebrow={section.eyebrow}
          title={section.title}
          intro={section.intro}
          criteria={section.criteria}
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
        // A keyed Fragment, never a wrapper element: every section component
        // renders its own full-bleed <section>, and an extra div around it
        // would sit between that and <main>.
        <Fragment key={`${section.type}-${i}`}>
          {renderSection(section, i)}
        </Fragment>
      ))}
    </>
  );
}
