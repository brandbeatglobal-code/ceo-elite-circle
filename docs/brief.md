# CEO Elite Circle — Project Brief

## Site structure (8 pages)
01. Homepage — Hero, Our Philosophy, Why the Circle Exists, Why Now, The Five
    Pillars, Signature Experiences, Membership Categories, Trust Framework,
    Membership Selection, Testimonials (placeholder), Apply, Footer.
02. About the Circle (`/about`) — Our Story, Our Purpose, Our Beliefs, Our
    Mission, Our Vision, Leadership Philosophy, Who We Serve, What Makes Us
    Different. Built on its own reference set: photo hero, Our Story over a
    wide photograph, Leadership Philosophy as a pull-quote over a photograph,
    What Makes Us Different as the icon grid.
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

## Current status
- Every page above exists as a real route with working navigation.
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
  - **Leadership / profile card grid** — needs real people, real photographs
    and real bios. Stock headshots with invented names would misrepresent
    people as the Circle's leadership. Not built even as an empty shell: an
    empty "our leadership" section still implies a roster that does not exist.
  - **Year-by-year timeline** — needs a real founding history. If there is a
    true story (when the Circle was conceived, when it launches, real
    near-term milestones) this becomes a strong section.
  All these patterns are in the reference if and when real content exists.
- The Leadership Philosophy pull-quote is built as structure only. Its slot
  carries an explicit note: it must hold real words from a real, named person,
  never something written on their behalf.
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
