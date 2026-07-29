# CEO Elite Circle — Project Brief

## Site structure (8 pages)
01. Homepage — Hero, Our Philosophy, Why the Circle Exists, Why Now, The Five
    Pillars, Signature Experiences, Membership Categories, Trust Framework,
    Membership Selection, Testimonials (placeholder), Apply, Footer.
02. About the Circle (`/about`) — Our Story, Leadership, Our Purpose, Our
    Beliefs, Our Mission, Our Vision, Leadership Philosophy, Who We Serve,
    What Makes Us Different. Built on its own reference set: photo hero, Our
    Story over a wide photograph, Leadership as a profile card row, Leadership
    Philosophy as a pull-quote over a photograph, What Makes Us Different as
    the icon grid.
03. The Five Pillars (`/pillars`) — Strategic Advisory, Elite Network,
    Executive Forums, Knowledge & Insights, Executive Councils. Each pillar
    needs its own full section with benefits, outcomes, and examples.
04. Signature Experiences (`/experiences`) — CEO Leadership Summit,
    Chairman's Majlis, Executive Leadership Retreat, Future Leadership
    Forum, CEO Excellence Awards, International CEO Delegation, CEO Private
    Dinners.
05. Membership (`/membership`) — Who Should Join, Membership Categories
    (Executive Circle, Elite Circle, Chairman's Circle), Membership
    Benefits, Membership Journey, FAQ, Apply.
06. Trust Framework (`/trust`) — Our Commitment, CEO Charter, Moderation
    Standards, Confidentiality, Governance, Member Conduct, Privacy,
    Conflict Resolution, Membership Review, Removal Policy. **Policy-level
    content — nothing here should be drafted without sign-off.**
07. Executive Councils (`/councils`) — Purpose, Councils, Meeting Format,
    Benefits, Annual Calendar, Expert Advisors.
08. Contact / Apply (`/contact`) — Application Form, Selection Process,
    Timeline, Interview, Review, Acceptance.
09. Insights (`/insights`) — list page. `/insights/[slug]` is the long-form
    article template.

### Detail routes
- `/pillars/[slug]` — one page per pillar (`strategic-advisory`,
  `elite-network`, `executive-forums`, `knowledge-insights`,
  `executive-councils`), linked from the list page.
- `/experiences/[slug]` — one page per experience (`ceo-leadership-summit`,
  `chairmans-majlis`, `executive-leadership-retreat`,
  `future-leadership-forum`, `ceo-excellence-awards`,
  `international-ceo-delegation`, `ceo-private-dinners`), linked from the
  list page.
- `/about/leadership/[slug]` — leadership profile template. Built and
  visitable, **deliberately unlinked** (see Current status).

Note: the pillar "Executive Councils" (`/pillars/executive-councils`) and the
top-level page `/councils` share a name but are different pages. That comes
from the original site brief and is not a mistake to fix.

## Design direction

The original White / Deep Green / Gold / Light Grey palette and the Cormorant
Garamond + Inter pairing have been **retired**. They are gone from the
codebase — do not reintroduce them or blend them with what follows.

### Palette (confirmed)
Tokens live in `src/app/globals.css`.

| Token | Hex | Role |
|---|---|---|
| `white` | `#ffffff` | Base white |
| `cream` | `#f3f3f1` | Light section backgrounds |
| `mint` | `#d8e1df` | Gradient step / subtle tint |
| `grey` | `#bcbcbc` | Gradient step / muted UI |
| `sage` | `#628c6c` | **The one accent** — links, rules, eyebrow bullets, hover. Never a background fill. |
| `olive` | `#6f7161` | Gradient step / muted text on cream |
| `ink` | `#3e4032` | Near-black olive — primary text on cream |
| `black` | `#000000` | Solid black section backgrounds |

Sections alternate between three treatments: the dark gradient (`.bg-ramp`,
`.bg-ramp-low`), solid black, and cream. The gradient runs the whole ramp —
mint through grey and sage, into olive, down to near-black — not a flat fade.

### Typography (confirmed)
- **Sora** — the workhorse: headlines, body, tags, buttons, nav. 300–700.
- **Fraunces**, Light — the special-occasion serif, reserved for premium
  moments only: the hero, card titles, list names, lead paragraphs.

Both are free stand-ins for the reference's commercial faces (TT Neoris and
Ivy Presto Headline), self-hosted via `@fontsource`. No live Google Fonts
fetch.

### The grid
Every section opens with the same header row: running index ("One", "Two"…)
at far left → bulleted eyebrow at the half-way rule → optional arrow link
flush right. Thin hairline rules at the quarter and the half, drawn with
`--color-hair` / `--color-hair-dark`. Content is often bottom-aligned in a
tall column, with the empty space above used deliberately.

### Motifs
- A `•` bullet precedes short labels and CTA button text.
- CTA buttons are full pills — the only rounded element on the page.
- Links end in a small `↗`.

### Detail-page patterns
Taken from the Service / Doctor / Blog reference set. Each is a component,
reused rather than re-cut per page:
- `CandidacyChecklist` — 2×2 icon grid answering "who is this for".
- `NumberedSteps` — hairline-divided numbered sequence. No dates.
- `VariantCards` — three named variants, no photos, no prices.
- `Accordion` — one item open, the rest collapsed to a title and `+`.
- `CvTimeline` — alternating centre-line timeline. Collapses to one column
  below `lg`, where alternating only hurts readability.
- `AttributedQuote` — pull-quote with a circular portrait and attribution.
- `SplitHero` / `DetailHero` — profile split-screen, and title-over-photo.

Patterns are applied per item, not stamped: pillars carry `VariantCards` only
where named formats plausibly exist (`variants` in `src/lib/pillars.ts`), and
carry no preparation steps at all — "Elite Network" has nothing to prepare
for. Experiences all carry `NumberedSteps`, since each is something a member
attends. Revisit both once real content exists; structure should follow
content.

### Icons
Confirmed as part of the system, and not only for the grid they debut in on
`/about`. All icons live in `src/components/Icons.tsx` and follow one rule:
thin single-weight hairline strokes, no fills, built from plain geometry —
arcs, rings, diamonds, ellipses. Abstract, never illustrative or literal, and
never decorative for its own sake. Anything added later goes in that file and
matches that style.

(The original brief's "no icons" line was about keeping the hero uncluttered,
not a site-wide ban. There is no conflict.)

### Photography
Mood shifts by section on purpose: dramatic low-light architecture in the
hero, desaturated documentary in the membership rows (rendered greyscale in
CSS), warm full-colour elsewhere. Free-licensed, hotlinked from Unsplash;
`images.unsplash.com` is allow-listed in `next.config.ts`.

**All photo slots live in `src/lib/images.ts`.** A slot with `src: null`
renders a labelled "photography pending" frame instead of an image, so a
missing photo reads as deliberate rather than broken. Filling one is a
one-line change.

## Microcopy conventions (client-specified, use verbatim)
- "Learn More" → **Discover the Circle**
- "Contact" → **Begin Your Membership Journey**
- "Apply" → **Request Membership Consideration**

## Copy rule — sample text vs. verifiable claims

The site carries **sample copy** at design stage, under one guardrail. Two
categories, treated differently:

**(a) Descriptive copy — written freely.** Section intros, pillar and
experience descriptions, benefits, candidacy criteria, FAQ answers, meeting
formats, "who should join". It reads as plausible, it will be replaced, and
nobody is harmed by reading it early.

**(b) Verifiable claims — never invented.** Named people (leadership,
advisors, authors), attributed quotes and testimonials, statistics and member
counts, awards, dates and founding history, named partner organisations,
prices and fees, and Trust Framework policy text. These stay labelled
placeholders.

Two rules follow from (b) and are worth stating outright:

- **Sample copy contains no numerals**, deliberately. A figure reads as a
  statistic even in draft.
- **The Trust Framework carries no sample copy at all.** Confidentiality,
  Member Conduct, Conflict Resolution and Removal Policy are commitments a
  prospective member could rely on; draft wording there reads as binding. The
  page gets visual treatment — numbering, accordion, two columns — and nothing
  else. Membership category descriptions are placeholders for the same reason.

While sample copy is live, `DraftBanner` shows a dismissible work-in-progress
notice site-wide. Removing it at launch means deleting the component and its
mount in `layout.tsx`. That is the whole removal.

### What is still empty, and why

Sample copy now fills the site. Five things stay pending, all for the same
reason — each would require inventing a specific real person or a published
artefact that does not exist:

1. **Leadership cards** (`/about`, 4 cards) — a name, face and bio would be a
   fictional person presented as running a real company.
2. **The leadership profile template** (`/about/leadership/template`) — same,
   and it is unlinked.
3. **Testimonials** (homepage, 3 cards) — an invented quote is manufactured
   social proof.
4. **The Leadership Philosophy pull-quote** (`/about`) — an attributed quote
   needs a real named person. Its supporting paragraph is filled.
5. **Expert Advisors** (`/councils`) — named individuals.

Plus **Trust Framework policy text** (ten areas), which is a commitment rather
than a description, and the **"article pending" cards** on `/insights` and in
the article template's related row — an invented headline implies published
writing that does not exist.

One real bio and one real quote close most of this.

## Motion

Restrained: 200–500ms, gentle easing, no bounce.

- Scroll-reveal on sections and grid items, with a small stagger. Fires once.
- Hero text settles in on load, staggered.
- Photographs lift slightly on hover; links and pills keep their existing
  transitions; the nav's scroll transition is eased.
- Accordion panels animate height via `grid-template-rows`.
- Carousel scrolls smoothly, and jumps under reduced motion.

Two constraints, both enforced rather than assumed:

1. **`prefers-reduced-motion: reduce` disables it entirely.** The inline
   script in `layout.tsx` only sets `js-anim` when motion is wanted, and all
   the hiding CSS is scoped to that class. Reduced motion means content is
   never hidden in the first place.
2. **Content is visible by default.** Nothing is hidden without JavaScript,
   because the class that hides it is only ever added by JavaScript. The
   observer in `Reveal.tsx` also shows anything already scrolled past when it
   attaches — otherwise browser scroll restoration or a fast scroll during
   load would strand that content invisible, since the observer only fires on
   entry.

## Current status
- Every page above exists as a real route with working navigation.
- Every page except `/contact` closes with the shared `RequestSection` —
  the two-column request form, disabled, taking the next number in that
  page's own running index. `/contact` is excluded because its own form is
  the real, wired-up version rather than a teaser of itself. Wiring the
  fields up is a change in one component, not seven pages.
- The homepage is built on the confirmed system above: photo hero, then
  eight indexed sections (Our Philosophy, Structure, Timing, Membership,
  Governance, Experiences, Testimonials, Begin), then the footer.
- The homepage hero uses the client's exact copy.
- **Every headline on the homepage is a section name taken from this brief.**
  No marketing prose has been written. Supporting copy is the `Placeholder`
  component throughout. Do not replace placeholder text with invented claims,
  especially on `/trust`, without explicit sign-off first.
- Several reference sections are deliberately **not built**, because they
  would require facts the Circle does not have yet:
  - **Impact stats** ("15+ years", "10,000+ procedures") and the smaller
    inline stat pairs ("99%", "50k+") — need real numbers: membership count,
    founding year, whatever is true.
  - **Awards & press** — needs real awards. Placeholder award names could
    later be mistaken for real ones.
  - **Year-by-year timeline** — needs a real founding history. If there is a
    true story (when the Circle was conceived, when it launches, real
    near-term milestones) this becomes a strong section.
  All these patterns are in the reference if and when real content exists.
- The Leadership Philosophy pull-quote is built as structure only. Its slot
  carries an explicit note: it must hold real words from a real, named person,
  never something written on their behalf.
- **The leadership profile template** (`/about/leadership/[slug]`) exists and
  works when visited directly, driven by `src/lib/leadership.ts`, whose one
  entry has every field null. It is **not linked from anywhere** — the About
  cards have no names, and minting a slug would mean inventing a person to
  hang it on. Adding a real member means filling the name, credentials, role,
  timeline and quote together, then linking the card.
- **Insights** has no real articles. `/insights` shows three labelled
  "article pending" cards that link nowhere, and `/insights/[slug]` exists as
  a structural template at `template`, unlinked, on the same reasoning. No
  invented statistics or claims anywhere in it — the reference article's
  "70% of adults" style line has no equivalent here.
- **Leadership** (`/about`, section Two) is built as honest empty structure,
  the same way Testimonials is on the homepage: four profile cards with the
  card shape intact — portrait, name/credentials slot, one-line description —
  and every slot a labelled placeholder. No stand-in names, no stock
  headshots, and no "learn more" link, since there is no roster page to point
  at. Filling a leadership portrait means naming a real person, so the card's
  name and bio have to be written in the same pass: a real face beside
  placeholder text reads as an unnamed real member.
- Testimonials render as an empty carousel shell. No photo and no quote is
  shown, because pairing a stock portrait with invented words would read as
  a real member.
- Live on Vercel already via direct deploy (project `ceo-elite-circle`).
  This repo is being connected as the permanent source so future changes
  go through git instead.

## Design reference
The layout system is taken from a Behance case study ("Spectra Eye Clinic —
UX/UI" by Margarita Kvasova). Grid, colour, type, background rhythm and
component patterns transfer. Their copy, logo and photography do not.

The 11 reference screenshots were supplied out-of-band and are **not
committed here** — they are a third party's published work. `docs/design-
reference/` is kept for our own material.
