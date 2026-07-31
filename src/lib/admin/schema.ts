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
   * The last part of a page's web address, or a reference to one. Unlike an
   * ordinary string this ends up in a URL, so it is held to what a URL can
   * carry cleanly: lowercase letters, numbers and hyphens. A capital or a
   * space would still build — it would just produce an address nobody can
   * type or repeat correctly, which is worse than a refused save.
   */
  | "slug"
  /**
   * A leaf of a photo slot. Never edited individually — the photo, its alt
   * text and its note change together through the photo editor.
   */
  | "image"
  /**
   * The key naming which mark sits above a label. The mark is design, not
   * copy — and a key that does not exist in `Icons.tsx` is a page that will
   * not render, so this is shown but never made typeable.
   */
  | "icon"
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
  // ---- The mark above a label. Structure, not copy: the set of valid keys
  // lives in `Icons.tsx`, and a key outside it would leave a section with no
  // mark to resolve.
  [
    /^[a-z]+:.*\.icon$/,
    {
      kind: "icon",
      nullable: false,
      structural:
        "Which mark sits above this label. The marks are part of the design and are chosen to agree with the words beneath them, so they are changed in the code rather than typed here.",
    },
  ],

  // ---- Photograph leaves. Reaching one individually is refused: a photo,
  // its alt text and its note are edited together, as one unit, through the
  // photo editor — alt text describes the image that is actually there.
  [
    /^[a-z]+:.*\bphoto\.(src|alt|note|brightness|textMode)$/,
    { kind: "image", nullable: true },
  ],

  // ---- Web addresses. The four detail routes are generated from these
  // arrays, so a slug is not a label — it *is* the page's address, and
  // changing one moves a live URL. Every link inside the site is built from
  // the value and follows it on its own; nothing outside the site does.
  // Editing is allowed, because renaming a page before launch is a real and
  // reasonable thing to want. Doing it unknowingly is what the note prevents.
  [
    // The featured experience is found by slug with a non-null assertion, so
    // a slug this no longer matches is a homepage that cannot be built.
    // Named ahead of the general rule because that consequence is worse than
    // a moved address and belongs on the field it applies to.
    /^experiences:items\.\*\.slug$/,
    {
      kind: "slug",
      nullable: false,
      structural:
        "The last part of this experience's web address. Changing it moves the live page: the old address starts returning the site's \"page not found\", so any link, bookmark or search result pointing at it stops working. Links inside the site are built from this value and follow it on their own. One experience is also named on the homepage as the featured one — if this is that experience, the homepage's featured field has to be changed to match at the same time, or the site will not build. Lowercase letters, numbers and hyphens only.",
    },
  ],
  [
    /^[a-z]+:.*\.slug$/,
    {
      kind: "slug",
      nullable: false,
      structural:
        "The last part of this page's web address. Changing it moves the live page: the old address starts returning the site's \"page not found\", so any link, bookmark or search result pointing at it stops working. Links inside the site are built from this value and follow it on their own; nothing outside the site does. Lowercase letters, numbers and hyphens only.",
    },
  ],
  [
    /^homepage:experiences\.featuredSlug$/,
    {
      kind: "slug",
      nullable: false,
      structural:
        "Which experience gets the large panel on this section, named by the last part of its web address rather than by its title. It has to match one of the experiences exactly — a value matching none of them stops the site building — so change it by copying the address of the experience you want. Lowercase letters, numbers and hyphens only.",
    },
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
  // The three About leadership cards are real, named people — the one place
  // on the site where a text field is a factual claim about someone rather
  // than copy. Nothing here may be reworded to suit the voice.
  [
    /^about:leadership\.cards\.\*\.(name|title|description)$/,
    {
      kind: "text",
      nullable: false,
      structural:
        "This is a real, named person. Every word here is a claim about them — a title they hold, a company they worked for, a qualification they earned — so it is changed only on their say-so, never rephrased to read better. The card holds a name, one title line and one short line of description; longer copy belongs on a profile page rather than here.",
      multiline: true,
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
  if (rule.kind === "image" || rule.kind === "group" || rule.kind === "icon") {
    return false;
  }
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
  // Measured, not assumed. The slot is a fixed height inside a card that is a
  // third of the row, so it is landscape at desktop (1.10) and mobile (1.19)
  // and portrait only in the narrow band between them (0.62 at 768). Both
  // frames are shown, because a headshot that survives one and not the other
  // is worth seeing before it is uploaded rather than after.
  [
    /^about:leadership\.cards\.\*\.photo$/,
    [
      { label: "Leadership card (desktop and mobile)", ratio: 11 / 10 },
      { label: "Leadership card (tablet)", ratio: 5 / 8 },
    ],
  ],
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

/**
 * Which slots actually carry copy over the photograph, and what one text mode
 * governs on each.
 *
 * Every photo slot holds a `textMode` so the shape stays uniform, but on most
 * of them it does nothing — a leadership portrait has no words on top of it.
 * Offering a control that changes nothing is worse than not offering it, so
 * the toggle appears only where this says it does, and the sentence names
 * every element it moves. A slot used in two places names both: one mode
 * governs the whole of each, because the site never carries two text
 * treatments on one background.
 */
const TEXT_OVER: [RegExp, string][] = [
  [
    /^homepage:hero\.photo$/,
    "This hero's headline, both lines of copy, the button's border and label, and the navigation bar while it is still transparent over the photograph.",
  ],
  [
    /^about:hero\.photo$/,
    "This hero's eyebrow, headline and both columns of copy, and the navigation bar while it is still transparent over the photograph.",
  ],
  [
    /^about:philosophy\.photo$/,
    "The whole Leadership Philosophy section — its header row, headline, pull-quote and supporting paragraph.",
  ],
  [
    /^pillars:items\.\*\.photo$/,
    "This pillar's detail-page hero — eyebrow, title, summary and the button's border and label — and the homepage card that shows this photograph on hover. On the card the copy changes colour with the photograph, so it stays legible in the state where the picture is not showing.",
  ],
  [
    /^experiences:items\.\*\.photo$/,
    "This experience's detail-page hero — eyebrow, title, summary and the button's border and label.",
  ],
];

export function textOverPhoto(file: string, path: string[]): string | null {
  const key = `${file}:${genericPath(path)}`;
  return TEXT_OVER.find(([re]) => re.test(key))?.[1] ?? null;
}
