/**
 * Field rules for the admin.
 *
 * The registry walk (`registry.ts`) discovers *what* fields exist; this layer
 * says how each one behaves — whether it can be edited, whether it may be
 * cleared, and what clearing it would do to the site. Both the form and the
 * server-side validation read from here, so a field cannot be rendered as
 * editable and then rejected on save, or vice versa.
 *
 * Paths are matched with array indices collapsed to `*`, so a rule written
 * once covers every item in a list.
 */
export type FieldKind =
  /** An ordinary string field. */
  | "text"
  /** An internal route. Validated to start with `/`. */
  | "path"
  /**
   * A leaf of a photo slot. Never edited individually — the photo, its alt
   * text and its note change together through the photo editor.
   */
  | "image"
  /**
   * A whole list or record rather than a value — including when it is
   * currently null. Never gets a text input: typing into one of these would
   * replace a structure with a sentence.
   */
  | "group";

export type FieldRule = {
  kind: FieldKind;
  /** May be cleared back to null. */
  nullable: boolean;
  /**
   * What this field does beyond carrying words. Rendered as a visible note on
   * the field, so clearing something structural never feels like clearing a
   * sentence.
   */
  structural?: string;
  multiline?: boolean;
};

/** `["items", "0", "criteria", "1"]` → `"items.*.criteria.*"`. */
export function genericPath(path: string[]): string {
  return path.map((s) => (/^\d+$/.test(s) ? "*" : s)).join(".");
}

const NULLABLE_NOTE =
  "Leaving this empty keeps the labelled placeholder on the page — which is the honest state until there is real material for it.";

/**
 * Rules by `file:path`. The first match wins, so specific patterns come before
 * the wildcards at the end.
 */
const RULES: [RegExp, FieldRule][] = [
  // ---- Photograph leaves. Reaching one individually is refused: a photo,
  // its alt text and its note are edited together, as one unit, through the
  // photo editor — alt text describes the image that is actually there.
  [
    /^[a-z]+:.*\bphoto\.(src|alt|note)$/,
    { kind: "image", nullable: true },
  ],

  // ---- Structural: absence changes what renders, not just what it says.
  [
    /^forms:[a-z]+\.ctaHref$/,
    {
      kind: "path",
      nullable: true,
      structural:
        "This is what makes the button a live link instead of a disabled one. Leave it empty and the button stays visibly unfinished, like the fields above it. Only set it to a page that actually does what the button's label promises — a working button that goes somewhere else is the one thing on this section that could mislead.",
    },
  ],
  [
    /^pillars:items\.\*\.variants$/,
    {
      kind: "group",
      nullable: true,
      structural:
        "Present, this adds the whole \"How it is offered\" section to this pillar's page and shifts the section numbering below it. Two pillars deliberately carry none.",
    },
  ],
  [
    /^insights:published$/,
    {
      kind: "group",
      nullable: false,
      structural:
        "The Insights index renders from this list. While it is empty the page shows labelled \"article pending\" cards instead of pretending to have posts.",
    },
  ],
  [
    /^leadership:members\.\*\.(name|credentials|role|intro)$/,
    {
      kind: "text",
      nullable: true,
      structural:
        "Fill every field on a profile at the same time. A real name beside placeholder text reads as a half-published person — and only once a profile is complete should the About page link to it.",
      multiline: true,
    },
  ],
  [
    /^leadership:members\.\*\.quote$/,
    {
      kind: "group",
      nullable: true,
      structural:
        "A pull-quote must be real words from the real, named person. While this is empty the page shows a labelled placeholder, which is the honest state.",
    },
  ],
  [
    /^leadership:members\.\*\.quote\./,
    {
      kind: "text",
      nullable: true,
      structural:
        "A pull-quote must be real words from the real, named person. Nothing should be written on anyone's behalf.",
      multiline: true,
    },
  ],
  [
    /^insights:articles\.\*\.(readingTime|author|publisher|date)$/,
    {
      kind: "text",
      nullable: true,
      structural:
        "An author, a publisher and a date are verifiable claims. While these are empty the article shows \"pending\" rather than a figure someone could rely on.",
    },
  ],
  [
    /^insights:articles\.\*\.title$/,
    { kind: "text", nullable: true, structural: NULLABLE_NOTE },
  ],

  // ---- Content-honesty guardrails that are not about absence.
  [
    /^trust:areas\.items\.\*$/,
    {
      kind: "text",
      nullable: false,
      structural:
        "Area names only. Each area is a commitment a member could rely on, so the Trust Framework carries no policy wording until it is signed off — there is deliberately no field for that text here.",
    },
  ],
  [
    /^homepage:hero\.headline\.\*$/,
    {
      kind: "text",
      nullable: false,
      structural:
        "One line of the hero headline. The breaks between lines are deliberate, and the last line is indented on wide screens.",
    },
  ],
  [
    /^membership:categories\.items\.\*\.(name|body)$/,
    {
      kind: "text",
      nullable: false,
      structural:
        "The homepage teaser reads the categories from this file too, so editing here changes both places — which is what stops them drifting apart.",
      multiline: true,
    },
  ],

  // ---- Ordinary routes carried inside link records.
  [/^site:.*\.href$/, { kind: "path", nullable: false }],

  // ---- Default.
  [/.*/, { kind: "text", nullable: false }],
];

/** Keys whose copy is long enough to want a textarea. */
const LONG_KEYS = new Set([
  "body",
  "intro",
  "lead",
  "note",
  "summary",
  "description",
  "support",
  "text",
  "quoteNote",
  "placeholderNote",
  "emptyNote",
  "relatedNote",
  "structural",
]);

export function fieldRule(
  file: string,
  path: string[],
  value: unknown,
): FieldRule {
  const key = `${file}:${genericPath(path)}`;
  const base = RULES.find(([re]) => re.test(key))![1];
  const leaf = path[path.length - 1] ?? "";
  const multiline =
    base.multiline ??
    (LONG_KEYS.has(leaf) || (typeof value === "string" && value.length > 90));
  return { ...base, multiline };
}

/** A leaf the form may render an input for. */
export function isEditableLeaf(value: unknown, rule: FieldRule): boolean {
  if (rule.kind === "image" || rule.kind === "group") return false;
  return typeof value === "string" || value === null;
}

/**
 * How a slot's photograph actually renders on the site, for the in-slot
 * preview. Every photo displays through `object-cover`, so what an editor
 * needs to see before saving is the crop — a preview at the slot's real
 * proportions, not the raw file. Slots whose photo renders in more than one
 * place get a frame per treatment.
 *
 * Ratios are width/height, read from the components' actual geometry.
 */
export type PhotoPreview = { label: string; ratio: number };

const PREVIEWS: [RegExp, PhotoPreview[]][] = [
  [
    /^pillars:items\.\*\.photo$/,
    [
      { label: "Detail-page hero (full-bleed)", ratio: 16 / 9 },
      { label: "Homepage pillar card (tall)", ratio: 2 / 3 },
    ],
  ],
  [
    /^experiences:items\.\*\.photo$/,
    [
      { label: "Detail-page hero (full-bleed)", ratio: 16 / 9 },
      { label: "Experiences page (half-width)", ratio: 4 / 5 },
    ],
  ],
  [/^homepage:hero\.photo$/, [{ label: "Homepage hero (full-bleed)", ratio: 16 / 9 }]],
  [/^homepage:whyNow\.photo$/, [{ label: "Half-width media section", ratio: 4 / 5 }]],
  [/^about:hero\.photo$/, [{ label: "About hero (full-bleed)", ratio: 16 / 9 }]],
  [/^about:story\.photo$/, [{ label: "Full-width band", ratio: 21 / 9 }]],
  [/^about:philosophy\.photo$/, [{ label: "Section background (wide)", ratio: 16 / 9 }]],
  [/^about:leadership\.cards\.\*\.photo$/, [{ label: "Leadership portrait", ratio: 3 / 4 }]],
  [/^leadership:members\.\*\.photo$/, [{ label: "Profile portrait", ratio: 3 / 4 }]],
  [/^membership:categories\.items\.\*\.photo$/, [{ label: "Category row (short, wide)", ratio: 2 / 1 }]],
  [/^insights:articles\.\*\.photo$/, [{ label: "Article lead image", ratio: 2 / 1 }]],
];

export function photoPreviews(file: string, path: string[]): PhotoPreview[] {
  const key = `${file}:${genericPath(path)}`;
  return (
    PREVIEWS.find(([re]) => re.test(key))?.[1] ?? [
      { label: "As it renders on the page", ratio: 3 / 2 },
    ]
  );
}
