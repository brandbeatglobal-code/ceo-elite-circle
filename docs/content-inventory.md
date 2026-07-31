# Content inventory

Every editable string and image on the site, where it lived before the Phase 1
migration, and where it lives now. Written as the spec for the JSON schema, and
kept as a record independent of the code.

"Editable" means a client could reasonably want to change it without a
developer. It excludes anything that is **structure**: route paths, section
ordering, the running index ("One", "Two"…), tone/background choices, grid
spans, and which component renders a section. Those stay in code, per the
confirmed scope — text and images only.

---

## Where content lives now

| File | Holds |
|---|---|
| `content/site.json` | Site metadata, nav, footer, draft banner |
| `content/forms.json` | The eight `RequestSection` variants |
| `content/homepage.json` | `/` |
| `content/about.json` | `/about` |
| `content/pillars.json` | `/pillars` and `/pillars/[slug]` |
| `content/experiences.json` | `/experiences` and `/experiences/[slug]` |
| `content/membership.json` | `/membership` (+ the homepage category teaser) |
| `content/trust.json` | `/trust` |
| `content/councils.json` | `/councils` |
| `content/contact.json` | `/contact` |
| `content/insights.json` | `/insights` and `/insights/[slug]` |
| `content/leadership.json` | `/about/leadership/[slug]` |

Each file is read by a thin typed loader in `src/lib/`, which is what pages
import. The loader declares the type and does nothing else — no defaulting, no
merging, no computation. Changing a value in the JSON changes the rendered page
and nothing else.

### Two files the brief did not name

`site.json` and `forms.json` are cross-page: the nav, the footer and the
closing-form variants belong to no single page, and duplicating them per page
is exactly the drift the shared-copy rule exists to prevent.

### One deliberate cross-reference

Membership categories live **only** in `content/membership.json`. The homepage
teaser reads them from there. This is the existing `src/lib/copy.ts` invariant
carried over: a homepage teaser and its full page must not be able to drift.
An admin editing the homepage will not find category copy under `homepage.json`
— that is correct, not an omission.

---

## Global

### `content/site.json`

| Field | Was | Note |
|---|---|---|
| `metadata.title` | `src/app/layout.tsx` | Browser/tab title |
| `metadata.description` | `src/app/layout.tsx` | |
| `metadata.titleSuffix` | assembled inline in five `generateMetadata` calls | `" — CEO Elite Circle"` |
| `metadata.fallbackTitle` | same | Used when a record has no title |
| `pageTitles.*` | `export const metadata` in six page files | One per static page |
| `brand` | `Nav.tsx`, `Footer.tsx` | "CEO Elite Circle", rendered in both |
| `nav.groups[].heading` | `Nav.tsx` | Three groups |
| `nav.groups[].links[].label` | `Nav.tsx` | |
| `nav.groups[].links[].href` | `Nav.tsx` | **Structure** — carried in JSON because it is part of the link record, but not to be exposed as an editable field in Phase 3 |
| `nav.cta.label` | `Nav.tsx` | "Begin Your Membership Journey" |
| `nav.menuLabel` / `nav.closeLabel` | `Nav.tsx` | Mobile toggle |
| `nav.menuAriaLabel` | `Nav.tsx` | |
| `footer.tagline` | `Footer.tsx` | |
| `footer.columns[]` | `Footer.tsx` | Mirrors the nav groups plus a "Begin" column |
| `footer.legal[]` | `Footer.tsx` | Four items. The `©` year is computed, not content |
| `draftBanner.text` | `DraftBanner.tsx` | |
| `draftBanner.dismissLabel` | `DismissDraftBanner.tsx` | |

### `content/forms.json`

The eight closing-form variants. Each carries: `eyebrow`, `heading`, `lead`,
`body`, `columns[]` (`legend` + `inputs[]` or `selects[]`), `note`, `cta`, and
an optional `ctaHref`.

Was: the `configs` record in `src/components/RequestSection.tsx`.

Variants: `membership`, `application`, `pillar`, `experience`, `governance`,
`council`, `briefings`, `enquiry`.

Two rules survive the move and are load-bearing:

- **`ctaHref` is set only where the destination does what the label promises.**
  Today that is `membership` and `application` only (both → `/contact`).
  Everything else renders a disabled button. Adding a `ctaHref` to a variant
  whose CTA has nowhere honest to go turns a visibly-unfinished control into a
  working one that lies.
- The shared `CONTACT` column (Name / Surname / Phone number / Email) was one
  object reused by two variants. It is now written out in both, because a JSON
  file cannot hold a reference and an admin editing one variant should not
  silently change another.

---

## `/` — `content/homepage.json`

| Field | Was |
|---|---|
| `hero.photo` | `images.ts` → `photos.hero` |
| `hero.headline[]` | page.tsx — three lines, hard-broken deliberately; the third is indented at `lg` |
| `hero.lead` | page.tsx |
| `hero.body` | page.tsx |
| `hero.cta` | page.tsx |
| `philosophy.eyebrow` / `.title` / `.lead` / `.body` | page.tsx |
| `philosophy.link.label`, `.arrowLabel` | page.tsx |
| `pillars.eyebrow` / `.title` / `.lead` / `.link.label` | page.tsx |
| `pillars.cardLabel`, `.cardLinkLabel` | page.tsx — "Pillar", "Discover the Circle" |
| `whyNow.eyebrow` / `.title` / `.lead` / `.body` / `.linkLabel` | page.tsx |
| `whyNow.photo` | `images.ts` → `photos.whyNow` |
| `categories.eyebrow` / `.title` / `.link.label` / `.rowLabel` / `.rowLinkLabel` | page.tsx |
| — category name/body/photo | **not here** — `membership.json` |
| `governance.eyebrow` / `.title` / `.lead` / `.body` / `.link.label` | page.tsx |
| `governance.primaryLinkLabel`, `.secondaryLinkLabel` | page.tsx |
| `experiences.eyebrow` / `.title` / `.lead` / `.link.label` | page.tsx |
| `experiences.featuredSlug` | page.tsx — was `experiences.find(e => e.slug === "ceo-private-dinners")` |
| `experiences.featuredLinkLabel`, `.listLinkLabel` | page.tsx |
| `testimonials.eyebrow` / `.title` / `.note` / `.cardLabel` | page.tsx |
| `testimonials.memberLabel` / `.attributionNote` | new — the filled card's label, and its pending-name note |
| `testimonials.items[]` — 3 × (`quote`, `attribution`) | new — all null; filling one switches that card to a real quotation |
| `request.variant` | page.tsx |

Pillar and experience names, summaries and photos come from
`pillars.json` / `experiences.json`. The homepage renders the first five
pillars and all seven experiences; nothing is duplicated.

## `/about` — `content/about.json`

| Field | Was |
|---|---|
| `hero.*` (eyebrow, title, left, right) | page.tsx |
| `hero.photo` | `photos.aboutHero` |
| `story.eyebrow` / `.title` / `.lead` / `.body` | page.tsx |
| `story.photo` | `photos.aboutStory` |
| `leadership.eyebrow` / `.title` / `.intro` | page.tsx |
| `leadership.cards[]` — 3 × (`name`, `title`, `description`, `photo`) | `photos.leadershipOne`…`Four`; the three text fields are new |
| `sections[]` — 5 × (`title`, `lead`, `body`) | page.tsx — Purpose, Beliefs, Mission, Vision, Who We Serve |
| `philosophy.eyebrow` / `.title` / `.support` | page.tsx |
| `philosophy.quote` / `.quoteAttribution` | new — the real pull-quote and who said it |
| `philosophy.quoteNote` / `.attributionNote` | page.tsx — the text shown *inside* each empty frame |
| `philosophy.photo` | `photos.aboutPhilosophy` |
| `differences.eyebrow` / `.title` / `.intro` | page.tsx |
| `differences.features[]` — 4 × (`icon`, `label`, `body`) | page.tsx |

`icon` is a key (`rings` / `arcs` / `stack` / `orbit`) resolved to a component
in the page. The icon set is design; the label and body are content.

`leadership.cards[]` went from four photo-only slots to **three cards with
real people in them** — name, title line, one-line description, and a photo
slot still pending. The count is content, not layout: `ProfileGrid` sizes its
row to however many cards it is handed, so a fourth would appear without a
code change (and the grid would need one, since three columns are hardcoded
for three people). The three text fields are the only place in `content/`
where a string is a factual claim about a named person; `schema.ts` gives
them a note in the admin saying they are changed only on that person's
say-so.

**Section order is code.** `sections[0..3]` render as Three–Six, the philosophy
pull-quote as Seven, `sections[4]` as Eight. That split is layout, so the array
order in JSON is read positionally and adding a sixth entry would not add a
section.

## `/pillars`, `/pillars/[slug]` — `content/pillars.json`

`page` block: `title`, `eyebrow`, `intro`, `itemEyebrowPrefix`, `linkLabel`.

`detail` block: the labels shared by all five detail pages — `heroEyebrow`,
`aboutEyebrow`, `variantsEyebrow`, `variantsTitle`, `variantsIntro`,
`criteriaEyebrow`, `criteriaTitle`, `criteriaIntro`, `requestContextLabel`.

`items[]`: `slug`, `name`, `photo`, `summary`, `intro`, `criteria[]`
(`title` + `body`), optional `variants[]` (`name` + `body`).

Was: `src/lib/pillars.ts` plus the labels hardcoded in both page files.

**`detail.variantsIntro` carries a `{name}` token** — it was
`` `${pillar.name} runs in more than one shape…` ``. The token is resolved at
render. It is the only templated string on the site.

`variants` is present on three pillars and absent on two, and that is
deliberate: Elite Network and Knowledge & Insights have no meaningful list of
formats. Absent `variants` also removes a section, so the detail page's running
index shifts — handled by the existing local counter, not by content.

## `/experiences`, `/experiences/[slug]` — `content/experiences.json`

Same shape as pillars: `page`, `detail`, `items[]`.

`items[]`: `slug`, `name`, `photo`, `summary`, `intro`, `criteria[]`,
`steps[]` (`title` + `body`).

Was: `src/lib/experiences.ts`.

**`steps` used to be generated.** A helper, `attend(what)`, produced the same
four steps for all seven experiences with one noun interpolated ("the summit",
"the majlis", "a private dinner"…). They are now written out per experience —
28 step records instead of one template. That is the point: a client editing
the summit's lead-up should not silently rewrite the awards evening's. The
resolved text is identical to what the helper produced.

## `/membership` — `content/membership.json`

| Field | Was |
|---|---|
| `hero.*` | page.tsx |
| `whoShouldJoin.*` + `criteria[]` | page.tsx |
| `categories.eyebrow` / `.title` / `.intro` | page.tsx + `copy.ts` (`membershipCategoriesIntro`) |
| `categories.rowLabel`, `.rowLinkLabel` | page.tsx |
| `categories.items[]` — 3 × (`name`, `body`, `photo`) | `copy.ts` (`tiers`) + `images.ts` (`tier*`) |
| `benefits.*` + `features[]` | page.tsx |
| `journey.*` + `steps[]` | page.tsx |
| `faq.*` + `items[]` | page.tsx |
| `request.variant` | page.tsx — `application` |

Category descriptions stay descriptive: they say what each category involves
and state no fee, no headcount and no entitlement that reads as a term.

## `/trust` — `content/trust.json`

| Field | Was |
|---|---|
| `hero.*` | page.tsx |
| `status.eyebrow` / `.title` / `.lead` / `.body` | page.tsx |
| `areas.eyebrow` / `.title` / `.label` / `.body` | page.tsx |
| `areas.items[]` — ten × (`name`, `body`) | page.tsx; `body` is new |

**This file holds the site's only signed-off policy text.** For most of the
project an area was a bare name and `areas.placeholderNote` stood in for its
wording — there was deliberately no field to draft into, because each area is
a commitment a member could rely on and draft wording reads as binding whether
or not it is finished.

The founder signed the ten areas off, so `body` exists and carries them, and
`placeholderNote` is gone. The rule that replaced "do not draft these" is **do
not edit these**: an area's wording changes only when the wording itself has
been agreed again, never tidied for rhythm, shortened to fit or rephrased into
the site's voice. `schema.ts` puts that on both fields in the admin. Note the
split on the page — everything outside the accordion (hero, Status, labels) is
ordinary descriptive copy about the framework and carries no commitment.

## `/councils` — `content/councils.json`

`hero`, `purpose` (title/lead/body), `councils` (+ 3 items), `format` (+ 4
steps), `benefits` (+ 4 features), `calendar` (+ 4 steps), `advisors`
(eyebrow, title, placeholder note), `request.variant`.

Was: page.tsx throughout. Expert Advisors names real people, so it stays a
placeholder note rather than content.

## `/contact` — `content/contact.json`

`hero`, `form` (eyebrow, two column legends, field lists, consent label,
CTA, disabled note), `selection` (eyebrow/title/intro + 5 steps).

Was: page.tsx. `/contact` is the only page with no `RequestSection` — its own
form is the real one — so its form copy lives here rather than in `forms.json`.

## `/insights`, `/insights/[slug]` — `content/insights.json`

`page`: hero, list-section eyebrow/title/intro, the pending-card label, the
pending-card photo note, and the "template exists / stays unlinked" note.

`detail`: the article-template labels — section eyebrows, the metadata row
labels (Reading time / Author / Published by / Date of publication), the
"pending" value word, the related-articles heading and note.

`articles[]`: every article the site can render. `slug`, `title`, `photo`,
`readingTime`, `author`, `publisher`, `date`, and `body` — the prose, which was
originally hardcoded in `insights/[slug]/page.tsx`.

`body` is `{ sections[], note, pullQuote }`, where a section is
`{ heading, paragraphs[], listItems }`. It began as fixed
opening/list/closing slots and became an array when the first real article
arrived with four prose sections and no bulleted list: the old shape could only
carry the one article it had been written around. `note` and `pullQuote` are
nullable — slots the design offers, not things every piece comes with.

Two entries now. `template` keeps every metadata field null, which renders as
"pending" and is honest for something never published. The first real article,
`why-the-best-counsel-rarely-comes-from-a-consultant`, is credited to the
Circle as publisher with no individual author; on a published article a null
metadata field is omitted rather than shown as "pending".

**`published[]` is a list of slugs**, not a second copy of each article — two
copies would drift, and the admin only ever edits one field at a time. It is
what the index links, and it is what keeps `template` unlinked: the template is
in `articles` and out of `published`. Keep it that way.

## `/about/leadership/[slug]` — `content/leadership.json`

`detail`: the template's labels — hero eyebrow, expertise eyebrow/title,
career eyebrow/title, recognition eyebrow/title, philosophy eyebrow, the
`Area`/`Recognition` placeholder-row prefixes, and the pull-quote note.

`members[]`: one entry, `template`, every text field null. `slug`, `photo`,
`name`, `credentials`, `role`, `intro`, `timeline[]`, `expertise[]`, `quote`.

Was: `src/lib/leadership.ts`. Unchanged in substance — it was already a
null-filled record designed to be a data edit rather than a template rewrite.

---

## What deliberately did **not** move

- **Section numbering.** `src/lib/ordinal.ts` and every `ordinal(n)` call. The
  running index is structure, and the three idioms that keep it contiguous
  (hardcoded list, `ordinal(i)` in a map, local counter) all depend on code.
- **Icon choice.** `src/components/Icons.tsx` and the `icon` keys. Which
  hairline mark sits above a label is design.
- **Tone and layout props** — `tone`, `flip`, `greyscale`, `cover`, grid spans,
  `sizes`, transition delays.
- **Route paths and `generateStaticParams`.** A slug is an address.
- **The `Placeholder` component's default sentence.** It is a system default,
  not page copy. Per-slot overrides (`note`) did move, since those are written
  for a specific slot.
- **The `©` year** in the footer, which is computed.
- **`src/lib/ordinal.ts`, `Reveal.tsx`, `template.tsx`, `globals.css`.** No
  content.

## Things that were not a clean lift

Recorded here because they are the places a future change is most likely to go
wrong. All four are also flagged in the migration report.

1. **`attend()` expanded.** One generated template → 28 literal step records
   (`experiences.json`). Resolved text identical.
2. **`{name}` token.** `pillars.detail.variantsIntro` is the one string that
   interpolates a value at render.
3. **The shared `CONTACT` column duplicated.** One object reused by two form
   variants → written out in both (`forms.json`).
4. **`photos.privateDinners` was referenced twice.** Once as the featured
   experience's photo on the homepage, once as that experience's own photo. It
   is now stored once, on the experience, and the homepage reads it from there.

## File formatting

Every file is stored exactly as `JSON.stringify(data, null, 2)` plus a trailing
newline. The admin rewrites whole files with that serialiser when a field is
saved, so hand-formatting (the blank lines `forms.json` originally carried
between variants) would be destroyed on the first edit. The files were
normalised to the canonical form when editing shipped, which is a
whitespace-only change — the data round-trips identically.

## Conditional logic that depends on content values

Not defects — but they mean a content edit can change which sections render,
so the admin does not treat every field as inert text. Each of these carries a
visible structural note on its field, and the ones that would change a file's
*shape* (rather than a value in it) cannot be edited through the admin at all.

- `pillars.items[].variants` — absent removes the Formats section, and shifts
  that page's running index. It also flips the criteria section's tone from
  `black` to `cream`, because two dark sections would otherwise stack.
- `insights.published` — the slugs the index links. Empty renders the "article
  pending" cards and the "template stays unlinked" note instead of real ones.
  A slug listed here that matches no article is silently dropped rather than
  crashing the build, but it also means the article is not linked from
  anywhere.
- `leadership.members[].name` / `.credentials` / `.intro` / `.quote` /
  `.timeline` / `.expertise` — each null falls back to a placeholder.
- `insights.articles[].title` and the four metadata fields — same.
- `photo.src: null` — renders the labelled "photography pending" frame.
- `photo.textMode` — `light` (white copy) or `dark` (`--color-ink`), for the
  sections that carry words over the picture. One value governs the whole
  section, the nav included where the bar is transparent over a hero. Every
  slot carries the field so the shape stays uniform; it only *does* anything
  on the slots `textOverPhoto()` in `src/lib/admin/schema.ts` names, which are
  the two heroes, the About philosophy pull-quote, and the pillar and
  experience arrays. That list is also what decides whether the admin offers
  the toggle at all — a leadership portrait has no copy over it, so it gets no
  control. On an empty slot the value is ignored until a photograph lands.
- `forms.*.ctaHref` — absent renders a disabled button instead of a link.
- `forms.*.columns.length` — one column widens to two grid columns.

---

## Content fields vs empty-state notes

Some slots carry two fields that read alike in the admin and are not alike at
all:

| Field | What it is |
|---|---|
| `about.philosophy.quote` | the pull-quote itself |
| `about.philosophy.quoteNote` | the sentence shown *inside* the dashed frame while there is no quote |
| `homepage.testimonials.items[].quote` | a member's words |
| `homepage.testimonials.note` / `.cardLabel` | what the section says while none have been given |
| `councils.advisors.placeholderNote` | what the empty Expert Advisors section says |
| `insights.page.emptyNote` | what the index says while nothing is published |
| `leadership.detail.quoteNote` | the profile template's empty pull-quote frame |

**Real content typed into a `*Note` field renders as a placeholder** — dashed
border, muted italic — because that is what the note is drawn inside. It has
happened once: the About philosophy quote. `schema.ts` now puts a note on
every `*Note` field in the admin saying so, and the slots that can hold real
content have their own fields beside them.
