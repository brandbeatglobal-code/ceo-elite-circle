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
   * The key naming which mark sits above a label.
   *
   * Chosen from a grid of the actual drawings, never typed. It was read-only
   * for exactly one reason — as free text, a key outside `Icons.tsx` left a
   * section with no mark to resolve — and a picker closes that by
   * construction rather than by closing the field: the only values it can
   * produce are the ones it drew.
   */
  | "icon"
  /**
   * Text the site shows *in place of* something it has not been given — the
   * sentence inside a dashed pending frame, the label on a waiting card, the
   * word standing in for a date nobody has set. It is a brief to whoever
   * fills the slot, and it disappears on its own the moment they do.
   *
   * Shown but never typeable, for the same reason `icon` is. This is the one
   * category the panel has actively taught wrong: real content has been typed
   * into these fields twice — the About pull-quote, then a member's
   * testimonial across three of them — and both times it rendered as a
   * placeholder, dashed and muted, reading as unfinished while being
   * finished. Labelling them was the fix the first time and it did not hold,
   * so they are read-only now and grouped away from the content fields rather
   * than sitting among them.
   */
  | "empty-state"
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
 * Every field that only renders while something else is still empty, and the
 * sentence saying which slot it is standing in for.
 *
 * **Enumerated one by one, deliberately, rather than matched on a name.** A
 * `*Note` suffix rule is what let this through the second time: the three
 * fields that took a member's testimonial were `note`, `cardLabel` and
 * `attributionNote`, and only the last of them ends in "Note". `memberLabel`
 * and `careerPeriodLabel` are the same category and look like ordinary labels;
 * `noteLabel` and every `linkLabel` are *not* this category and look exactly
 * like they are. The name is not a signal. This list is the signal, so a new
 * placeholder field has to be added here on purpose — which is the point,
 * because the cost of missing one is a field that invites the mistake back.
 *
 * Each sentence names the field that does take the real thing, so the panel
 * can point somewhere rather than only refuse.
 *
 * Photo `note`s are the same idea and are absent from this list on purpose:
 * they are already inseparable from their own image in the photo editor, which
 * is the arrangement this list is trying to reproduce for text.
 */
const EMPTY_STATE: [RegExp, string][] = [
  [
    /^about:philosophy\.quoteNote$/,
    "The sentence inside the dashed frame where the Leadership Philosophy pull-quote goes. The words themselves belong in \"quote\", just below.",
  ],
  [
    /^about:philosophy\.attributionNote$/,
    "The sentence inside the dashed frame beneath that pull-quote, shown while nobody has been named as having said it. A name belongs in \"quote attribution\".",
  ],
  [
    /^councils:advisors\.placeholderNote$/,
    "The sentence standing in for the whole Expert Advisors section, which stays deliberately empty until there are real, named people to list.",
  ],
  [
    /^homepage:testimonials\.note$/,
    "The paragraph beside the Testimonials heading, shown only while every card is still empty. A member's words belong in \"items\", on the card itself.",
  ],
  [
    /^homepage:testimonials\.cardLabel$/,
    "The label on a testimonial card that has no quote yet. A member's words belong in that card's own \"quote\".",
  ],
  [
    /^homepage:testimonials\.memberLabel$/,
    "What sits above a quote whose attribution has not been agreed yet. An agreed one belongs in that card's own \"attribution\".",
  ],
  [
    /^homepage:testimonials\.attributionNote$/,
    "The sentence inside the dashed frame under a quote nobody has been credited for. The credit belongs in that card's own \"attribution\".",
  ],
  [
    /^insights:page\.emptyNote$/,
    "The paragraph the Insights index shows while no article is published at all.",
  ],
  [
    /^insights:page\.pendingCardLabel$/,
    "The label on the \"article pending\" cards the Insights index shows in place of posts it does not have.",
  ],
  [
    /^insights:page\.pendingCardPhotoNote$/,
    "The label inside the empty photograph frame on one of those pending cards.",
  ],
  [
    /^insights:detail\.pendingValue$/,
    "The word shown in place of an article's author, publisher, date or reading time while that field is empty. Fill the article's own fields instead.",
  ],
  [
    /^insights:detail\.relatedNote$/,
    "The paragraph in the related row at the foot of an article, shown while there is no second article to link to.",
  ],
  [
    /^insights:detail\.relatedCardLabel$/,
    "The label on one of those pending related cards.",
  ],
  [
    /^insights:detail\.relatedCardPhotoNote$/,
    "The label inside the empty photograph frame on one of those cards.",
  ],
  [
    /^leadership:detail\.quoteNote$/,
    "The sentence inside the dashed frame where a profile's pull-quote goes. The words belong in that member's own \"quote\".",
  ],
  [
    /^leadership:detail\.expertisePlaceholderPrefix$/,
    "The word before a number on each stand-in \"areas of expertise\" entry, shown while a profile has none of its own.",
  ],
  [
    /^leadership:detail\.recognitionPlaceholderPrefix$/,
    "The word before a number on each stand-in recognition entry, shown while a profile has none of its own.",
  ],
  [
    /^leadership:detail\.careerPeriodLabel$/,
    "The label on each stand-in row of a profile's career timeline, shown while that profile has no timeline of its own.",
  ],
];

const EMPTY_STATE_RULES: [RegExp, FieldRule][] = EMPTY_STATE.map(
  ([re, standsIn]) => [
    re,
    {
      kind: "empty-state",
      nullable: false,
      structural: `${standsIn} It is not the content — it is what shows until the content arrives, and it goes away by itself once it does. Real words typed here render as a placeholder: dashed border, muted italic, reading as unfinished while being finished. That is why this one cannot be typed into.`,
      multiline: true,
    },
  ],
);

/**
 * Rules by `file:path`. The first match wins, so specific patterns come before
 * the wildcards at the end.
 */
const RULES: [RegExp, FieldRule][] = [
  // ---- Placeholder text, first, so nothing below can claim one of these by
  // accident. Every entry is an exact path, so none of them reaches a field
  // the rules underneath are meant to own.
  ...EMPTY_STATE_RULES,

  // ---- The mark above a label. Structure, not copy: the set of valid keys
  // lives in `Icons.tsx`, and a key outside it would leave a section with no
  // mark to resolve.
  [
    /^[a-z]+:.*\.icon$/,
    {
      kind: "icon",
      nullable: false,
      structural:
        "Which mark sits above this label. The marks are part of the design, and the one rule they follow is that a mark has to say what its label says — so choose the one whose meaning matches the words beneath it, rather than the one that looks best on its own. Reusing a mark elsewhere on the site is fine where the idea really is the same; what to avoid is the same run of marks appearing under unrelated words.",
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
    /^forms:[a-z]+\.note$/,
    {
      kind: "text",
      nullable: false,
      structural:
        "The sentence under the form's button. These forms send real email to the Circle now, so this is where a visitor is told what sending actually does — and, just as importantly, what it does not do. Only the two application variants may describe themselves as an application; the rest must not imply a booking, a place, or a decision that sending does not produce.",
      multiline: true,
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
        "Which articles the Insights index links, named by their web addresses. While it is empty the page shows labelled \"article pending\" cards instead of pretending to have posts. An article that is written but not listed here is reachable at its own address and linked from nowhere — which is exactly how the unpublished template is kept out of sight.",
    },
  ],
  [
    // An entry is a reference to an article's address, not a title. It is the
    // switch that publishes a piece, so a typo here silently unpublishes one.
    /^insights:published\.\*$/,
    {
      kind: "slug",
      nullable: false,
      structural:
        "One article, named by the last part of its web address rather than by its title. It has to match an article exactly — a value matching none of them does not break the site, it just quietly drops that article off the Insights index while leaving it reachable at its own address. Copy the address from the article rather than typing it. Lowercase letters, numbers and hyphens only.",
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
  // ---- Placeholder text used to be matched here, by name, and that is what
  // failed. It is enumerated in `EMPTY_STATE` above and read-only now.

  // ---- Real quoted material. Words attributed to a person are the strictest
  // case in the copy rule: nothing is written on anyone's behalf.
  [
    /^about:philosophy\.(quote|quoteAttribution)$/,
    {
      kind: "text",
      nullable: true,
      structural:
        "Real words from a real, named person — never written on their behalf, and never tidied afterwards. Filling the quote switches this section from its pending frame to an actual pull-quote. Leave the attribution empty until you can name the person and they have agreed to be named: the quote then renders properly with the missing name shown as still outstanding, which is honest, rather than appearing as an unsourced quotation.",
      multiline: true,
    },
  ],
  [
    /^homepage:testimonials\.items\.\*\.(quote|attribution)$/,
    {
      kind: "text",
      nullable: true,
      structural:
        "A member's own words, and their name. Filling the quote turns this card from a labelled waiting card into a real testimonial. Both need the member's agreement — an invented or unapproved quote is manufactured social proof, which is the one thing this section must never carry. Leaving the name empty while the quote is filled shows the attribution as outstanding rather than hiding that it is missing.",
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
  // ---- The Trust Framework's ten areas. This field did not exist until the
  // wording was signed off, which was the point: nothing could be drafted here
  // by accident. Now that it holds approved policy, the guardrail changes
  // shape rather than disappearing — it is the one text field on the site that
  // a member is entitled to rely on as written.
  [
    /^trust:areas\.items\.\*\.body$/,
    {
      kind: "text",
      nullable: false,
      structural:
        "Signed-off policy text. A member reads this as a term they are held to and can hold the Circle to, so it is changed only when the wording itself has been agreed again — never tidied for rhythm, shortened to fit, or rephrased to match the rest of the site. If what you want to change is how the framework is described rather than what it commits to, the hero and Status section above are the place for that.",
      multiline: true,
    },
  ],
  [
    /^trust:areas\.items\.\*\.name$/,
    {
      kind: "text",
      nullable: false,
      structural:
        "The name of a policy area, as signed off alongside its wording. Renaming one changes what the framework says it covers, so it travels with the text beneath it rather than being edited on its own.",
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
  // `icon` is absent from this list on purpose: it is editable, just not
  // typeable. `ValueView` sends it to the picker before it ever reaches here.
  if (
    rule.kind === "image" ||
    rule.kind === "group" ||
    rule.kind === "empty-state"
  ) {
    return false;
  }
  return typeof value === "string" || value === null;
}

/** Placeholder text, shown apart from the content fields and never typeable. */
export function isEmptyStateField(file: string, path: string[]): boolean {
  const key = `${file}:${genericPath(path)}`;
  return EMPTY_STATE.some(([re]) => re.test(key));
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
