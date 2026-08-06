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
    content. Signed off by the founder and published in full; the rule is now
    that it is not edited without the same sign-off.**
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
  Its scrim is the same brightness-and-mode pair the full-bleed sections use,
  heavy where text sits and light through the middle band, which is empty by
  construction. Its copy colour follows the slot's text mode on the same
  selectors the image fades on, because off hover there is no photograph —
  only the black section the card sits in.

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

**The copy colour is chosen per section; the overlay only helps.** That is a
deliberate reversal. The overlay used to carry legibility on its own —
calibrated against a white photograph, solved to hold the background behind
the copy at `0.081` luminance whatever the image. It worked, and on a bright
photograph it meant a `0.42` wash plus a `0.86` field composing to `0.92`,
which is near enough black. The night skyline on the homepage was a dark
rectangle.

So there are two mechanisms now, and it matters which does what.

**1. `photo.textMode`, light or dark.** Every photo slot carries it; the
sections that hold words over a picture read it. `light` is white copy, as
before; `dark` is `--color-ink`, the near-black olive already used on cream —
never pure black. Two values rather than a picker, because the site never
carries more than two text treatments on one background.

- **One value governs a whole section**: headline, body, the CTA pill's border
  and label, the hairline grid, and the navigation bar while it is still
  transparent over that hero. `Nav` reads the hero's mode through `SiteChrome`
  (a server component, so the content files stay out of the client bundle)
  rather than hardcoding white — that hardcoding is exactly how a dark-mode
  hero would strand white links on a pale photograph.
- The slots it does anything on are listed in `textOverPhoto()` in
  `src/lib/admin/schema.ts`, which is also what decides whether the admin
  offers the toggle. A leadership portrait carries the field and no control.
- On an empty slot the mode is ignored: the pending frame sits on the dark
  ramp, where white is the only legible colour.
- Everything defaults to `light`, so nothing on the site changed colour when
  this landed.

**2. The scrim, now a light touch.** Same brightness-aware curve, much lower.
Across the fifteen photographs actually on the site the total falls from
0.81–0.92 to 0.21–0.45, and the section-wide wash to 0.07–0.16.

- Still a wash on the section plus a heavier field under the copy, feathered
  over the container's own padding so it has no visible edge (`.photo-scrim`
  and the `.copy-scrim*` classes). `PhotoCard` is on the same pair now instead
  of its own fixed `0.94 / 0.94 / 0.6`.
- Both alphas are still solved from the photograph. Light copy holds the
  brightest region at or below `0.26` luminance — about **3.4:1** for white
  text, short of AA on purpose. Dark copy lifts it to at least `0.62`, about
  6.8:1 for ink; the two thresholds are mirror images about mid-grey. A floor
  of 0.15 means no photograph is ever completely unprotected, and a cap of 0.5
  means none is darkened or bleached past a light touch.
- **The scrim's colour follows the mode** — black under white copy, white
  under ink. A black wash under ink copy would be a control fighting itself.
- **The alphas are solved in sRGB channel space, not by multiplying a
  luminance.** That is where a browser actually composites an overlay; the old
  model treated the measured luminance as if it multiplied like a channel
  value, which overstated an overlay's effect by roughly an order of magnitude
  and is part of why the result was so heavy.
- The brightness is measured on upload — the brightest *region*, not the mean,
  because a dark photograph with a blown-out window in it averages dark and
  the headline lands on the window. An unmeasured slot (`brightness: null`) is
  treated as white.
- Nothing over a photograph is dimmer than 75% white, or 80% ink. `Placeholder`
  takes `onPhoto` for exactly this, on both sides now — olive is comfortable on
  cream and marginal over a picture, so `onPhoto` takes it to full ink.
- **No photograph, no scrim.** An empty slot renders the pending frame on the
  dark ramp, where the copy is already legible and a field would only bury the
  frame's label.

**3. The contrast maths is kept, as guidance.** The admin's photo editor shows
an estimated ratio beside the toggle — "Approximately 3.4:1 — WCAG recommends
4.5:1 for body text" — and never refuses a save. It says what it is measured
against, because that differs by mode: the brightest region is the **worst**
case for white copy and the **best** case for ink, and nothing stored knows how
dark the dark parts of a picture are. In light mode the reading sits at 3.4:1
for essentially every photograph, by construction; that is the honest number
now, not an edge case.

`/about`'s philosophy pull-quote is copy from top to bottom, so its field
covers the whole section. At the old strength the photograph read as texture
rather than as an image; at the new one it survives.

Verified by measurement rather than by reading the CSS — see *Verification*.

#### What the photographs on the site actually measure

Every filled slot, its measured brightness, and the total scrim it gets — the
old figure alongside, because the size of the change is the point. All
nineteen are `light`; the dark column is what each would get if it were
switched. Snapshot: photographs are replaced through the admin and remeasured
on the way in, so re-derive rather than trust this if it matters.

| Slot | Brightness | Was | Light now | Dark |
|---|---|---|---|---|
| homepage — hero | 0.585 | 0.86 | 0.31 | 0.15 |
| homepage — whyNow | 0.997 | 0.92 | 0.45 | 0.15 |
| about — hero | 0.962 | 0.92 | 0.44 | 0.15 |
| about — story | 0.746 | 0.89 | 0.38 | 0.15 |
| Strategic Advisory | 1 | 0.92 | 0.45 | 0.15 |
| Elite Network | 1 | 0.92 | 0.45 | 0.15 |
| Executive Forums | 0.991 | 0.92 | 0.45 | 0.15 |
| Knowledge & Insights | 1 | 0.92 | 0.45 | 0.15 |
| Executive Councils | 0.98 | 0.92 | 0.45 | 0.15 |
| CEO Leadership Summit | 0.435 | 0.81 | 0.21 | 0.38 |
| Chairman's Majlis | 0.606 | 0.87 | 0.32 | 0.15 |
| Executive Leadership Retreat | 1 | 0.92 | 0.45 | 0.15 |
| Future Leadership Forum | 0.971 | 0.92 | 0.45 | 0.15 |
| Elite Excellence Awards | 0.48 | 0.83 | 0.24 | 0.31 |
| International CEO Delegation | 0.611 | 0.87 | 0.32 | 0.15 |
| CEO Private Dinners | 0.578 | 0.86 | 0.30 | 0.15 |
| Executive Circle | 0.693 | 0.88 | 0.36 | 0.15 |
| Elite Circle | 1 | 0.92 | 0.45 | 0.15 |
| Chairman's Circle | 0.747 | 0.89 | 0.38 | 0.15 |

Two things worth reading off it. **The old column is nearly flat** — 0.81 to
0.92 across a set whose brightness ranges from 0.435 to 1.0 — because
`1 − 0.081/b` saturates almost immediately. It was brightness-aware in form
and barely in effect. The new column spans 0.21 to 0.45 over the same set,
which is what "a bright photograph gets more help than a dark one" was meant
to mean.

And **the photography on the site skews light**: seventeen of nineteen measure
0.58 or brighter, six are 1.0. So the set does not flatter the change — the
photographs that gain most from a lighter scrim are the dark ones, and there
are few of them here.

The slots filled by hand at design stage were measured in place through a
one-time route, on 30 July 2026 — commits `093f255`, `83b4764`, `cf2c899`.
That route has been deleted; measuring a *new* image is not its job, since
uploads are measured on the way in. Several of the figures above post-date it,
because those photographs have since been replaced through the admin.

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

### They send

All nine — the eight variants and `/contact`'s own form — post to one server
action, `src/app/(site)/submit.ts`, which emails the submission through Resend.
Nothing is stored anywhere; the inbox is the record. `RESEND_API_KEY` is set in
Vercel's dashboard only, and is read solely inside `src/lib/mail.ts`, which is
`server-only` — a client import of it is a build error rather than a leaked
key.

Everything currently lands at one address, `FORM_RECIPIENT` in `mail.ts`,
because Resend has no verified sending domain for this project yet. That is why
the subject line carries the form's identity:

| Form | Subject |
|---|---|
| `membership` | `Membership Request — [Name]` |
| `application` | `Membership Application — [Name]` |
| `pillar` | `Pillar Enquiry: [Pillar] — [Name]` |
| `experience` | `Experience Enquiry: [Experience] — [Name]` |
| `governance` | `Governance Question — [Name]` |
| `council` | `Council Interest — [Name]` |
| `briefings` | `Briefings Subscription — [Email]` |
| `contact` | `Contact Form — [Name]` |
| `enquiry` | `Leadership Enquiry — [Name]` |

The last is not in the owner's list — the leadership profile pages that carry
it are built but deliberately linked from nowhere, so no visitor can reach it
today. It is named to the same pattern rather than left to fall through.

The body is every submitted field, labelled, then the pre-filled context where
there is one, and the page it was sent from. `reply_to` is the sender's own
address, so a reply goes straight back.

### What the email looks like

`src/emails/FormSubmission.tsx` — **one template for all nine forms**, built on
React Email, whose primitives compile to tables with inline styles. Every
message goes out as HTML *and* plain text (multipart/alternative); the text
half is written from the same props rather than scraped from the markup, so the
two cannot say different things.

Reading down: a small wordmark, a sage hairline, then a sage `•` and the form's
name in small uppercase — the site's own section-header convention. The
sender's name follows as a serif line, the one place the contrast is worth
spending. Where the form carries pre-filled context, it sits in a block with a
sage left edge. Then one row per answer: label small, uppercase, olive; value
larger in ink; a hairline between each. A quiet two-line footer closes it.

It is the site's language, not its CSS, and three departures are on purpose:

- **Cream, never the dark ramp.** A business notification defaults to a light
  background in every client and under every reader's own dark-mode setting.
  Forcing dark risks looking broken somewhere nobody can test.
- **No web fonts.** Sora and Fraunces are not requested — most clients would not
  load them. A safe sans stack approximates Sora, Georgia stands in for
  Fraunces, and nothing depends on a class or a `<style>` block.
- **Sage stays an accent.** A rule, a bullet, a left edge; never a background
  fill, exactly as the palette above says. It is also the safest choice, since
  a colour block is what a client's dark mode inverts worst.

**Not verifiable from here:** how it renders in Outlook, Gmail and Apple Mail.
The constraints are checked mechanically and the output is rendered and read,
but only a real received message in each client settles it.

Rules that came out of building it:

- **A failure never reads as a success.** Sending, sent and failed are three
  distinct states; with no key set the message says the site cannot send rather
  than pretending. Nothing is claimed unless the server said so.
- **A refusal gives the answers back.** React clears an uncontrolled form once
  its action completes — right after a send, wrong after a refusal. The error
  state carries the values and an `attempt` counter used as a `key`, so the
  fields remount holding them. Without it the form empties the field it has
  just asked someone to correct.
- **A select needs a real list behind it.** Options come from the content that
  already defines them — membership categories, framework areas, councils — or,
  for a fixed taxonomy nothing on the site displays, from `formSpec.ts` itself.
  Every other `<select>` in the design had one `<option>` carrying the field's
  own label: an unusable control implying a taxonomy that does not exist. Those
  are text inputs now, so the visitor answers in their own words.
- **A dropdown has to belong to the page when it is open, not only when it is
  closed.** A native `<select>` hands its open state to the browser — white
  panel, system font, blue highlight — so the one moment the control was in use
  was the one moment it broke the design. The CSS answer,
  `appearance: base-select` with `::picker(select)`, is the right fix and is not
  usable yet: Chrome and Edge from 135, Safari only in the 27 beta, Firefox
  behind a flag, and not Baseline — it would leave Firefox and current-Safari
  visitors looking at exactly the bug. So `FormSelect.tsx` is the APG
  select-only combobox, built as **progressive enhancement over a real
  `<select>`**: with JavaScript off, or before hydration, the field is still the
  native control, and the value always travels under the field's own name.
  Revisit when Safari 27 ships and Firefox follows — the component becomes
  about fifteen lines of CSS.
- **`ctaHref` is gone.** It existed to distinguish a CTA that linked somewhere
  real from one that had to stay a dead button. Every button now submits its
  own form, which is what its label always said.

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

**A colour that changes with a mode is verified by resolving it, not by
reading the class.** Tailwind v4 computes `text-white/75` to
`oklab(0.999994 … / 0.75)`, which cannot be string-compared to the
`rgba(255, 255, 255, 0.75)` a hand-written rule produces — and `PhotoCard`'s
copy moved from the first form to the second when its colours became custom
properties. Paint the computed value into a 1×1 canvas over black and over
white and solve for the triple and its alpha; that is the only way the two
notations can be compared, and it is what proved the card's copy is the same
white it always was. Allow for 8-bit quantisation: an alpha of 0.75 reads back
as 191/255 = 0.749.

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
- **The Trust Framework carries no sample copy — it carries signed-off policy
  text.** Confidentiality, Member Conduct, Conflict Resolution and Removal
  Policy are commitments a prospective member could rely on, so draft wording
  there would read as binding. For most of this project the page therefore had
  visual treatment and nothing else, and `trust.json` had no field to draft
  into. The founder signed the ten areas off, so they are published in full and
  the guardrail changed shape: **an area's wording is not edited without the
  same sign-off**, and never tidied, shortened or rephrased into the site's
  voice. Membership category descriptions are still placeholders, for the
  reason the framework used to be.

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

Sample copy now fills the site. Four things stay pending, all for the same
reason — each would require inventing a specific real person or a published
artefact that does not exist:

1. **The leadership profile template** (`/about/leadership/template`) — a
   full profile for a real person needs a career timeline, areas of expertise
   and a quote, none of which we have. It is unlinked.
2. ~~**Testimonials** (homepage, 3 cards)~~ — **filled.** All three carry real
   member quotations, attributed by role and industry because the members
   agreed to be quoted and not to be named. See the status log below.
3. **The Leadership Philosophy attribution** (`/about`) — the quote itself is
   real and published. Who said it is not recorded, so the name keeps its
   pending frame beneath the quote rather than the quote going unsourced.
4. **Expert Advisors** (`/councils`) — named individuals.

**The About leadership cards came off this list**, which is what it was for.
Three real people, supplied by the Circle, with real titles and credentials.
Their headshots have not — each slot keeps the pending frame, labelled with
whose photograph belongs in it, which is the honest state rather than a stock
face standing in for someone who exists.

Two more came off the list at the same time as the leadership cards. **Trust
Framework policy text** is signed off and published in full. **Insights** has
its first real article, so `/insights` lists a post rather than "article
pending" cards — though the *related* row inside an article still shows them,
correctly, because there is only one article and it has no siblings yet.

One real quote closes most of what is left.

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
  the two-column request form, taking the next number in that page's own
  running index. `/contact` is excluded because it carries its own form
  rather than a teaser of itself. All of them now send; see § *Closing
  forms* → *They send*.
- The homepage is built on the confirmed system above: photo hero, then
  eight indexed sections (Our Philosophy, Structure, Timing, Membership,
  Governance, Experiences, Testimonials, Begin), then the footer.
- The homepage hero uses the client's exact copy.
- **Every headline on the homepage is a section name taken from this brief.**
  No marketing prose has been written. Supporting copy is the `Placeholder`
  component throughout. Do not replace placeholder text with invented claims
  without explicit sign-off first.
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
- **Insights has its first published article** — "Why the best counsel rarely
  comes from a consultant", approved by the founder. `/insights` lists it and
  links to it; `/insights/[slug]` renders it at its own address. The
  structural template stays at `template`, in `articles` and out of
  `published`, which is precisely what keeps it reachable directly and linked
  from nowhere. It is credited to the Circle as publisher with no individual
  author, on the same reasoning as the leadership bios: a name on a byline is
  that person's to give. Its lead image, side note and pull-quote are all
  empty — three slots the design offers that this piece did not arrive with.
  No invented statistics or claims anywhere in it.
- **Leadership** (`/about`, section Two) carries three real, named people —
  Dr Essa Al-Ahmad, Arshad Ali and Cicero Carvalho — each with a title line
  and one line of description. **Three cards, not four**: the row sizes itself
  to what it is given rather than holding a fixed four with a hole in it,
  which would read as a fourth person gone missing. Equal thirds at 768 and
  1440, stacked below.

  Two things stay as they were, deliberately. The photographs are still
  pending, so each slot renders the standard frame labelled with the person's
  name — a stock headshot on a real person is worse than no headshot. And the
  cards still carry no "learn more" link: the profile template is real but has
  no content for these three, so pointing at it would promise a page that does
  not exist yet.

  These fields are the one place on the site where the text is a factual claim
  about a person rather than copy. They are not sample copy and are not
  rewritten for voice — which is why "25+ years" carries a numeral that the
  no-numerals rule forbids everywhere else. That rule exists so draft prose
  cannot be mistaken for a statistic; a real figure about a real person is the
  case it was never aimed at. `schema.ts` gives all three fields a note in the
  admin saying so.
- Testimonials carry three real member quotations. They rendered as an empty
  carousel shell for most of this project, because pairing a stock portrait
  with invented words would read as a real member. No photograph is shown even
  now: the members agreed to be quoted, not identified.
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
  renders — a pillar's `variants`, the nullable leadership and Insights fields
  — carry a visible note saying so, so clearing one never feels like clearing a
  sentence. Adding or removing whole list entries is deferred.
- **Image upload works** (Phase 4). A photo, its alt text, its note and its
  text colour are edited together, as one unit. Uploads are validated by
  magic bytes (JPEG, PNG, WebP, HEIC only — HEIC converts to JPEG
  server-side, since iPhones default to it), re-encoded with metadata
  stripped, stored under
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
  now. The field is still editable on
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
- **A slot's styling follows its content.** The About philosophy pull-quote
  held a real line — "Capability, not just capital, will shape the future of
  Saudi Arabia." — and still rendered inside the dashed, muted placeholder
  box, because the line had been typed into `quoteNote`: the sentence shown
  *inside* the empty frame, not the quote field. There was no quote field.
  There is now, with an attribution beside it, and the section renders a real
  serif pull-quote when the words exist and the labelled frame when they do
  not. The attribution is empty, so the name shows as outstanding rather than
  the quote appearing unsourced.

  Every other slot that can take real content was audited for the same shape.
  The card components (`VariantCards`, `NumberedSteps`, `CandidacyChecklist`,
  `Section`, `DetailHero`) and the leadership profile template were already
  gated correctly. Homepage testimonials were not fillable at all — three
  hardcoded placeholders with no content behind them — so they gained the same
  shape and now switch when filled. `schema.ts` labels every `*Note` field in
  the admin as the empty-state text, which is the confusion that caused this.

- **The Trust Framework is published.** Its ten areas were the most protected
  thing in the repo — `trust.json` had no field for policy text at all, so
  nothing could be drafted into it by accident or through the admin. The
  founder signed the wording off, so the field exists now and carries it. The
  page was rewritten around that in one pass rather than piecemeal: the hero no
  longer says the framework is being finalised, the Status section no longer
  explains why the page is empty, the "Awaiting sign-off" label reads "In
  force", and the governance form no longer opens by saying the framework is
  unpublished. Its button stayed disabled at the time, because form handling
  was not wired up anywhere on the site; it was, in the change below. One
  statement outside `/trust` was false too and is fixed: `/membership`'s FAQ
  told visitors the framework "is being finalised".
- **Insights has a first real article**, "Why the best counsel rarely comes
  from a consultant". `published` changed from a second copy of each article to
  a list of slugs, so an article exists once and the list says which are live;
  the template stays out of it and therefore stays unlinked. The article body
  became a `sections` array in the same pass — the fixed
  opening/list/closing shape could only carry the one article it was written
  around, and the real piece has four prose sections and no bulleted list.
  Nothing was invented to fill the old shape.
- **Copy over a photograph is light or dark, chosen per slot, and the scrim
  has stepped back to a light touch.** The overlay was carrying legibility on
  its own and charging the photograph everything for it: 0.92 total on a
  bright image, which is a dark rectangle. Now `photo.textMode` decides the
  copy colour — white, or the near-black ink used on cream — and one value
  governs the whole section including the transparent nav above a hero, which
  `Nav` reads rather than hardcoding. The scrim keeps the same
  brightness-aware curve at a fraction of the strength (0.21–0.45 across the
  real set, against 0.81–0.92 before), flips colour with the mode, and is now
  solved in sRGB channel space rather than by multiplying a luminance — which
  the old code did, overstating an overlay's effect by about an order of
  magnitude. `PhotoCard` joined the same system instead of its own fixed
  0.94/0.94/0.6; on a card the copy colour switches on the same selectors the
  photograph fades on, since off hover there is no photograph. Every slot
  defaults to `light`, and sixteen copy colours across the three photo-backed
  patterns were resolved numerically and checked against the values the
  previous code produced — the card's move from Tailwind classes to custom
  properties is the one place a colour could have shifted silently, and it did
  not. The contrast maths survives as guidance in the admin, saying plainly
  that its number is the worst case for white copy and the best case for ink.
- **The forms send.** All nine — the eight closing variants and `/contact`'s
  own — post to one server action which emails the submission through Resend,
  to a single named recipient, with a per-form subject line. Nothing is stored;
  the inbox is the record. The key is read only inside a `server-only` module,
  and no secret, sender or recipient string reaches any asset the browser
  downloads. Details and the rules that came out of it are in § *Closing
  forms* → *They send*. Three things were decided rather than inherited:
  a `<select>` with no options behind it became a text input, since a dropdown
  implying a taxonomy that does not exist is the same failure as inventing
  copy; `ctaHref` was deleted, because a button that submits its own form has
  no destination to get wrong; and a refused submission hands the answers back
  rather than clearing the form, which React does by default after a form
  action and which would otherwise empty the field it has just asked someone to
  fix. **`RESEND_API_KEY` must be set in Vercel before any of this can send.**
  Until it is, every form refuses with a message saying the site cannot send —
  it never claims a submission went through.
- **The key is set, and a real submission has arrived.** The path is confirmed
  end to end against production, not only against the stand-in.
- **The notification email is designed**, through one shared React Email
  template rather than nine copies, and sends as HTML and plain text together.
  Cream rather than the site's dark ramp, no web fonts, sage as an accent only
  — the reasons are in § *Closing forms* → *What the email looks like*, along
  with the one thing that cannot be checked from here.
- **A dropdown looks like the site when it is open.** `FormSelect.tsx` replaces
  the native picker with the APG select-only combobox, as progressive
  enhancement over a real `<select>` — see the same section.
- **The homepage experiences panel responds.** Hovering or focusing any of the
  six listed occasions previews it in the featured panel; clicking or tapping
  pins it until something else takes over, which is what makes it work on a
  phone. The six rows' own "Discover" links carry the focus handling, so the
  keyboard drives it exactly as a pointer does. All seven photographs are
  stacked and cross-faded rather than swapped by `src`, so nothing fetches on
  hover and nothing flashes; the site-wide reduced-motion rule turns the fade
  into an instant swap without a branch in the component.

  The active row carries a sage left rule, the same accent a highlighted
  dropdown option gets. It is quiet on desktop, where the panel sits beside the
  list and already answers "which one"; it is the whole confirmation on a
  phone, where the panel is above the list and is genuinely scrolled out of
  view by the time a lower row is tapped. Drawn as a pseudo-element so the rows
  do not shift as it comes and goes, and derived from the same comparison that
  sets `aria-current`, so the two can never disagree.
- **The homepage testimonials are real.** Three quotations from members who
  agreed to be quoted but not to be named, so each is attributed by role and
  industry rather than by a person: "CEO, Heavy Manufacturing", "Founder,
  Global Fintech", "Chairwoman, International Healthcare". The cards were built
  to switch on content, so this was a data edit and the "no quotes have been
  given yet" note disappeared on its own.

  One markup change went with it. On a filled card the attribution now takes
  the position the "Awaiting member approval" label held, in the same
  sage-bulleted treatment, because with an anonymised attribution the label and
  the attribution would otherwise say the same thing twice. `memberLabel` still
  covers the half-finished case: a quote whose attribution has not been agreed.

  Two things about the transcription. The words are the members' own, so US
  spellings ("armor", "caliber") are left as given rather than matched to the
  site's British copy. And one aside was bracketed rather than comma-set —
  "wasn't the caliber of the leaders (that was expected) but the absolute
  vulnerability" — because commas around an independent clause inside a
  not/but pair read as a splice. Same call as the appositives in § *Closing
  forms*, and no word changed.

## Design reference
The layout system is taken from a Behance case study ("Spectra Eye Clinic —
UX/UI" by Margarita Kvasova). Grid, colour, type, background rhythm and
component patterns transfer. Their copy, logo and photography do not.

The 11 reference screenshots were supplied out-of-band and are **not
committed here** — they are a third party's published work. `docs/design-
reference/` is kept for our own material.
