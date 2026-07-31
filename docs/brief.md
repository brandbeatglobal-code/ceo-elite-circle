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
    Forum, Elite Excellence Awards, International CEO Delegation, CEO Private
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
  `future-leadership-forum`, `elite-excellence-awards`,
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

### Spacing
Rhythm was widened site-wide in one pass, through the class scale rather than
per-page nudges, so it stays consistent. The mapping: section blocks
`py-12 lg:py-16` → `py-16 lg:py-24`, bodies `py-12 lg:py-20` → `py-16 lg:py-28`,
the tallest `pt-24 pb-16 lg:pt-40 lg:pb-28` → `pt-32 pb-24 lg:pt-52 lg:pb-40`,
cards `py-10` → `py-14`, header rules `py-4` → `py-6`, section body gaps
`gap-6` → `gap-8`. Plus `.wrap` padding 1.25→1.5rem (2→2.75rem at md), and
looser copy: `.type-body` 1.62→1.75, `.type-lead` 1.42→1.52.

Mobile scales with it because the mapping raises the base value as well as the
`lg:` value. **The Tailwind `--spacing` token was deliberately not changed** —
it drives `w-*`/`h-*` as well as padding, so it would have resized icon boxes
and photo heights, which is layout rather than spacing.

### Motifs
- A `•` bullet precedes short labels and CTA button text.
- CTA buttons are full pills — the only rounded element on the page.
- Links end in a small `↗`.

### Detail-page patterns
Taken from the Service / Doctor / Blog reference set. Each is a component,
reused rather than re-cut per page:
- `CandidacyChecklist` — 2×2 icon grid answering "who is this for". Each
  criterion names its own mark; the component resolves it, the way the
  feature grids do.
- `NumberedSteps` — hairline-divided numbered sequence. No dates.
- `VariantCards` — three named variants, no photos, no prices.
- `Accordion` — one item open, the rest collapsed to a title and `+`.
- `CvTimeline` — alternating centre-line timeline. Collapses to one column
  below `lg`, where alternating only hurts readability.
- `AttributedQuote` — pull-quote with a circular portrait and attribution.
- `SplitHero` / `DetailHero` — profile split-screen, and title-over-photo.
- `PhotoCard` — tall card with a photograph behind it, revealed on hover. The
  photograph is decorative: every word is legible with or without it, and on
  touch (`@media (hover: none)`) it simply shows, so nothing is unreachable.
  The `black/85` overlay is set so white text clears 4.5:1 even against a
  pure-white region of the photograph — an average-luminance overlay fails
  exactly where a blown-out highlight sits behind a line of text.

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

**A mark has to say what its label says.** The set is sixteen, each with its
meaning written above its definition:

| | | | |
|---|---|---|---|
| `rings` the Circle; a bounded set | `arcs` a meeting point; counsel both ways | `stack` accumulation over time | `orbit` reach across regions |
| `threshold` admission; crossing in | `compass` direction; judgement | `converge` the final call | `lattice` structure; a discipline |
| `horizon` the long view | `pair` one to one; an introduction | `crest` distinction; recognition | `ascent` progression; transition |
| `signal` said, or heard | `weave` a network | `chamber` a closed room; discretion | `cycle` a recurring year |

Two sections landing on the same mark is fine when the concepts really are the
same. What is not fine is the same *sequence* under unrelated words: four
marks spread across sixteen sections meant 25+ appearances of an identical
run, which reads as decoration repeating itself. Sixteen sections now carry
sixteen distinct sequences, and no section repeats a mark inside itself.

Two marks were redrawn after seeing them at size: a ring broken at the top
with a line through it is the standby glyph, and an upright symmetrical needle
inside a ring reads as an eye once small. Borrowed meanings are not abstract,
they are just wrong. Check a new mark at 20px and on the dark ramp, not only
in the editor.

(The original brief's "no icons" line was about keeping the hero uncluttered,
not a site-wide ban. There is no conflict.)

### Photography
Mood shifts by section on purpose: dramatic low-light architecture in the
hero, desaturated documentary in the membership rows (rendered greyscale in
CSS), warm full-colour elsewhere. Free-licensed, hotlinked from Unsplash;
`images.unsplash.com` is allow-listed in `next.config.ts`.

**Photo slots live on the page or item they belong to, in that section's file
under `content/`.** A slot with `src: null` renders a labelled "photography
pending" frame instead of an image, so a missing photo reads as deliberate
rather than broken. Filling one is a one-line edit to the JSON — or an upload
through the admin, which is the case the next rule exists for.

### Text over a photograph

**An overlay is calibrated against a white photograph, never against the one
that happens to be there today.** The mood above is a direction, not a
guarantee: anyone can upload a bright image through the admin in one click,
and a hero whose legibility depended on the photographer choosing dusk breaks
the moment they don't.

The rule is the one `PhotoCard` already followed, applied to every full-bleed
section (`.photo-scrim` and the `.copy-scrim*` classes in `globals.css`):

- A wash on the section so the photograph reads, and a heavier field on the
  copy itself, feathered in over the container's own padding so it has no
  visible edge.
- **Both alphas are solved from the photograph, not fixed.** The rule is a
  ceiling: whatever the image, the background behind the copy is brought to
  `0.081` luminance — about 8:1 for white text — and no further. A white
  photograph therefore gets `black/42` and `black/86`, which composite to
  `(1 − 0.86)(1 − 0.42) = 0.081`; the homepage's night skyline, measured at
  brightness 0.369, gets `black/35` and `black/66` and keeps 2.7× more of
  itself for exactly the same contrast.
- The brightness is measured on upload — the brightest *region* of the image,
  not its mean, because a dark photograph with a blown-out window in it
  averages dark and the headline lands on the window. An unmeasured slot
  (`brightness: null`) is treated as white.
- A ceiling on the *composite* is the point. Two layers each calibrated
  against a white photograph compound to ~0.92 where they overlap, which is
  most of a hero; that is what flattened the skyline to near-black even though
  each layer was correct on its own.
- Nothing over a photograph is dimmer than 75% white — 55% clears 4.5:1 on the
  near-black ramp but not against a bright image behind a scrim. `Placeholder`
  takes `onPhoto` for exactly this.
- **No photograph, no scrim.** An empty slot renders the pending frame on the
  dark ramp, where the copy is already legible and a field would only bury the
  frame's label.

`/about`'s philosophy pull-quote is copy from top to bottom, so its field
covers the whole section and the photograph reads as texture rather than as an
image. That is the honest cost of the rule, not an oversight: there is no
empty band there to leave light.

Verified by measurement rather than by reading the CSS — see *Verification*.

#### What the design-stage photographs actually measure

Every slot filled by hand at design stage was measured in place, through the
admin, on 30 July 2026 — commits `093f255`, `83b4764`, `cf2c899`. Each one was
`null` beforehand, so this table is the whole record; the images, their URLs
and their licensing were not touched.

| Slot | Brightness | Scrim it now gets |
|---|---|---|
| Strategic Advisory | 0.708 | 0.399 / 0.810 |
| Elite Network | 0.982 | 0.413 / 0.860 |
| Executive Forums | 1.0 | 0.414 / 0.862 |
| Knowledge & Insights | 1.0 | 0.414 / 0.862 |
| Executive Councils | 0.551 | 0.384 / 0.761 |
| CEO Leadership Summit | 0.834 | 0.406 / 0.836 |
| Chairman's Majlis | 0.999 | 0.414 / 0.862 |
| Executive Leadership Retreat | 1.0 | 0.414 / 0.862 |
| Future Leadership Forum | 0.971 | 0.413 / 0.858 |
| Elite Excellence Awards | 0.48 | 0.374 / 0.730 |
| International CEO Delegation | 0.611 | 0.390 / 0.783 |
| CEO Private Dinners | 0.905 | 0.410 / 0.848 |
| Executive Circle | 1.0 | 0.414 / 0.862 |
| Elite Circle | 0.998 | 0.414 / 0.862 |
| Chairman's Circle | 0.803 | 0.405 / 0.831 |

**Eleven of the fifteen measure 0.8 or brighter, and three are 1.0.** This
stock photography skews light, which is precisely the case the ceiling exists
for — most of these were already getting close to the treatment they needed,
and the three at 1.0 resolve to `0.4136 / 0.8619`, byte-identical to the
unmeasured default. Nothing about them changed; the measurement only made that
provable rather than incidental.

The two genuinely mid-toned images — Executive Councils at 0.551 and Elite
Excellence Awards at 0.48 — are the ones that gain, and even they are nowhere
near the homepage's night skyline at 0.369. Worth knowing when judging the
rule: it looks generous on this set because this set is bright. It earns its
keep on the dark ones.

The route that produced this has been deleted. Measuring a *new* image is not
its job — uploads are measured on the way in.

## Closing forms

Every page ends with `RequestSection`, which takes a `variant` — one component,
not copies. A governance page and a briefings index must not both close with a
membership application. The variants live in `content/forms.json`; the
route-to-variant map below stays in code, because which form closes a page is
structure rather than copy.

| Route | Variant |
|---|---|
| `/`, `/about`, `/pillars`, `/experiences` | `membership` |
| `/membership` | `application` |
| `/pillars/[slug]` | `pillar` — inert context chip naming the pillar |
| `/experiences/[slug]` | `experience` — inert context chip naming the occasion |
| `/trust` | `governance` — explicitly not an application |
| `/councils` | `council` |
| `/insights`, `/insights/[slug]` | `briefings` — name and email only |
| `/about/leadership/[slug]` | `enquiry` |
| `/contact` | none; its own form is the real one |

Rules: no field implies a capability that does not exist (no upload,
scheduling or payment); pre-filled context is rendered inert rather than as an
editable field; only the two application variants may call themselves an
application.

## Verification

Measurement and screenshots catch different failures, so do both on any visual
change. Capture at desktop **and** mobile, capture both states for anything
hover-dependent, and capture with reduced motion — otherwise you photograph
the animation instead of the page.

Two failures that prove the point: the hero/nav overlap passed a width sweep
while being visibly broken (height was the axis that mattered), and the fixed
draft notice overlapping the hero CTA was invisible in full-page captures,
because fixed elements render at the capture origin rather than the viewport
bottom. Both needed the other method to find.

**Contrast over a photograph is measured, not calculated.** Point every photo
slot at a deliberately high-key (pure white) image, capture the page, then
capture it again with the text set to `transparent` — which keeps every box
exactly where it was, so the scrims are unchanged — and read the *lightest*
pixel behind each text element out of that second capture. Contrast is then
computed between the element's own resolved colour and that worst case.
Details that matter: Tailwind v4 colours compute to `oklch(...)` and cannot be
parsed as `rgb`, so resolve each by painting it over black and over white and
solving for the triple and its alpha; sample the *padding* box, since an
element's own border ring is its chrome rather than its background; and hide
the fixed draft notice, whose white text otherwise lands in a full-page
capture wherever the first viewport ended.

**A save that depends on "what is there now" is tested with two saves, not
one.** The stale-base bug (see *Current status*) passed every single-edit
test. The sequence that catches it: save field A, rewind the running server's
`content/` to its pre-save bytes — which is exactly what a not-yet-redeployed
deployment has on disk — then save field B and assert field A's value in the
*repository*.

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
notice site-wide. It is **server-rendered**, so it is present for a visitor
without JavaScript — the visitor with no other signal that the copy is
provisional. Only the dismiss button is a client component; dismissal is a
`draft-dismissed` class on the document element, re-applied before paint by
the inline script in `layout.tsx`.

Removing it at launch: delete `DraftBanner`, `DismissDraftBanner`, their mount
in `SiteChrome.tsx`, and the `.draft-banner` rules plus the two `body` padding
rules in `globals.css`.

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

Page transitions live in `src/app/template.tsx`, which re-mounts on
navigation. Entry-only and opacity-only, 200ms: it cannot delay a route
change, and it leaves movement to the scroll reveal. It deliberately does not
run on first load — a module-level flag is false on the first render — so
above-fold content settles once rather than animating twice. View Transitions
was considered and not used: it needs a capability check plus a fallback in
every browser that lacks it, and snapshotting the outgoing page risks the
delay this is meant to avoid.

**Heroes must use `min-h-*`, never a fixed `h-*`.** They are bottom-anchored
(`flex flex-col justify-end`), so a fixed height compresses the content stack
upward on a short viewport and pushes the headline behind the fixed nav. With
`min-h` the section grows instead. Each hero also carries `pt-36 lg:pt-44`,
which clears the nav at its tallest. When changing a hero, sweep viewport
**height**, not width — width was never the axis that mattered.

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
- **Content has been lifted out of the components into `content/*.json`**
  (Phase 1 of the custom admin panel). Twelve files — one per page, plus
  `site.json` and `forms.json` — read by thin typed loaders in `src/lib/`.
  Nothing about the design or the rendered output changed: all 25 prerendered
  routes are byte-identical and all 46 screenshots pixel-identical against the
  build before the migration. `docs/content-inventory.md` records every field
  and where it came from. Later phases add the admin UI that edits these files;
  the schema is the contract they build against.
- **The admin's login and read-only shell exist** (Phase 2). `/admin` is
  password-gated (`ADMIN_PASSWORD` in Vercel's environment; unset means the
  route is the site's 404), sessions are a signed cookie, and the section
  list is derived from the `content/` directory rather than hand-kept. It
  shows every file's current values read-only; editing is Phase 3. The public
  pages moved into a `(site)` route group so the admin does not wear the
  marketing chrome — verified pixel-identical across all pages — and the site
  gained a designed 404 page in the process, since the previous default one
  lost its nav in the split.
- **Text editing works** (Phase 3). A field is edited and saved one at a time;
  the save is validated server-side, committed to `main` through the GitHub
  API, and published by the existing deploy. Fields whose absence changes what
  renders — a form's `ctaHref`, a pillar's `variants`, the nullable leadership
  and Insights fields — carry a visible note saying so, so clearing one never
  feels like clearing a sentence. Adding or removing whole list entries is
  deferred.
- **Image upload works** (Phase 4). A photo, its alt text and its note are
  edited together, as one unit. Uploads are validated by magic bytes (JPEG,
  PNG, WebP, HEIC only — HEIC converts to JPEG server-side, since iPhones
  default to it), re-encoded with metadata stripped, stored under
  `public/uploads/` with generated names, and committed in the same commit as
  the JSON pointing at them; a replaced upload is deleted in that commit too.
  The editor previews the crop inside the slot's real proportions before
  saving, and clearing a slot returns it to the standard pending frame.
- **A save no longer reverts a field it did not touch.** Two uploads seconds
  apart (`55544a8`, then `d0868d3`) both committed correctly in themselves,
  but the second one reverted the first: it had been applied to the deployed
  bundle's build-time copy of `homepage.json` rather than to what `main`
  actually held, and it committed the whole file. Every edit is now applied to
  the repository's copy, read at the moment of saving and pinned to a commit,
  and a save that cannot read it is refused rather than guessed at. The panel
  reads live too. `hero.photo` has been pointed back at the upload the bug
  discarded — the file itself was still in the repository, orphaned.
- **Heroes are legible over any photograph, not just a dark one.** Every
  full-bleed photo section carries the calibrated scrim described under
  *Text over a photograph* instead of a flat overlay. Measured against a pure
  white image in every slot, at three viewports: previously nothing cleared
  4.5:1 (the homepage headline 3.36:1, its body copy 2.60:1, the accent bullet
  1.05:1); now the worst element on any of them is 4.77:1.
- **The icon set is sixteen marks, and every assignment was chosen against its
  label.** Four marks were doing the work of sixteen sections — and
  `CandidacyChecklist` applied them by position, so all thirteen candidacy
  grids showed the same shapes in the same order whatever they said. All
  sixteen sections now carry distinct sequences, and none repeats a mark
  inside itself.
- **The navigation bar goes solid at 32px of scroll**, not at 82% of viewport
  height. The gap between the bar and the first line of hero copy bottoms out
  at 52px once the hero content overflows, so the old threshold let white
  headline text pass behind a transparent white bar on any window shorter than
  about 800px.
- **The scrim is sized to the photograph.** Two layers each calibrated against
  a white image compounded to ~0.92 where they overlap — most of a hero — and
  flattened the homepage's night skyline to near-black. Both alphas are now
  solved from the brightness measured on upload, holding the same contrast
  ceiling: the bright-probe measurement still passes 12/12 at the same worst
  case, and the skyline keeps 2.7× more of itself.
- The CEO Excellence Awards is now the **Elite Excellence Awards**, slug
  included — pre-launch, so the URL was renamed with the name rather than left
  saying something the page does not.
- Photographs filled in by hand at design stage carry no brightness
  measurement and therefore get the heaviest scrim by default. A one-time
  maintenance route measures them in place — the images, their URLs and their
  licensing are untouched — and is deleted once it has run.
- **A slug now says in the admin that it is a web address.** The four detail
  routes are generated from the content arrays, so `slug` is the page's
  address rather than a label — but no rule in `schema.ts` matched it, so it
  fell through to the default and rendered as an ordinary field with nothing
  distinguishing it from the name beneath it. It carries a `structural` note
  now, the same treatment as `ctaHref`. The field is still editable on
  purpose: renaming a page before launch is reasonable, doing it unknowingly
  is not. `homepage.json`'s `featuredSlug` got the same treatment, and says
  the harder thing — it is resolved with a non-null assertion, so a value
  matching no experience does not 404, it stops the site building.
- **And a slug is held to what a web address can carry** — `^[a-z0-9-]+$`,
  refused at save time. Editing the field was always meant to be allowed; what
  was not meant to be allowed is `Strategic Advisory` becoming a live URL. A
  capital or a space still builds and still routes, which is exactly why it
  needed catching: the failure is an address nobody can type or repeat, not an
  error anyone would see.

## Design reference
The layout system is taken from a Behance case study ("Spectra Eye Clinic —
UX/UI" by Margarita Kvasova). Grid, colour, type, background rhythm and
component patterns transfer. Their copy, logo and photography do not.

The 11 reference screenshots were supplied out-of-band and are **not
committed here** — they are a third party's published work. `docs/design-
reference/` is kept for our own material.
