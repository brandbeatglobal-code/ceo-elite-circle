import type { PageSection } from "@/components/SectionList";
import data from "../../content/councils.json";

/**
 * SAMPLE COPY, except Expert Advisors: that section names real individuals, so
 * it carries a placeholder note and no content field to fill.
 *
 * This is the first page whose body is a `sections` array rather than a set of
 * named keys. The loader stays what every loader here is — import, type,
 * export — and the array's own type lives with the renderer, in
 * `SectionList.tsx`, since it is the renderer that decides what a section can
 * be. Section numbers and background tones are not in this file and must not
 * be added to it: both are computed from array position at render time.
 */
export type CouncilsContent = {
  metaTitle: string;
  hero: { eyebrow: string; title: string; intro: string };
  sections: PageSection[];
};

export const councils = data as CouncilsContent;

/**
 * The names of the councils themselves, for the council form's dropdown.
 *
 * This exists because of what the migration cost. The list used to be reachable
 * as `councils.councils.items` — a named key, stable whatever else the page
 * did. In an ordered array it has no name and no fixed position, so a reader
 * outside the page has to *find* it, and `sections[1]` would be a silent bug
 * the first time the array was reordered.
 *
 * Finding it by type is right while the page carries one `variantCards`
 * section, which it does. A second one would make this ambiguous — it would
 * take the first and nobody would be told — so if the pilot grows a second,
 * sections need stable ids and this needs to ask for one by name.
 */
export function councilNames(): string[] {
  const section = councils.sections.find((s) => s.type === "variantCards");
  return section ? section.items.map((c) => c.name) : [];
}
