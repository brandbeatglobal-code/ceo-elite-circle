# CEO Elite Circle — Project Brief

## Site structure (8 pages)
01. Homepage — Hero, Our Philosophy, Why the Circle Exists, Why Now, The Five
    Pillars, Signature Experiences, Membership Categories, Trust Framework,
    Membership Selection, Testimonials (placeholder), Apply, Footer.
02. About the Circle (`/about`) — Our Story, Our Purpose, Our Beliefs, Our
    Mission, Our Vision, Leadership Philosophy, Who We Serve, What Makes Us
    Different.
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
- Palette: White, Deep Green (`#0e3b2f`), Gold (`#b08d46`), Light Grey
  (`#eeece6`). Tokens live in `src/app/globals.css`.
- Typography: Cormorant Garamond for headings, Inter for body — self-hosted
  via `@fontsource`, not fetched live from Google Fonts.
- Aesthetic references: Aman Hotels, Four Seasons, McKinsey, Rolex, The
  Ritz-Carlton, Saudi Vision 2030 publications. Minimal, elegant, timeless.
- No gradients, no flashy animation, no stock business photography.
  Executive silhouettes, architecture, Riyadh skyline, majlis settings, gold
  dividers, large typography, generous white space.

## Microcopy conventions (client-specified, use verbatim)
- "Learn More" → **Discover the Circle**
- "Contact" → **Begin Your Membership Journey**
- "Apply" → **Request Membership Consideration**

## Current status
- Every page above exists as a real route with working navigation.
- The homepage hero uses the client's exact copy.
- All other sections are labeled placeholders (see the `Placeholder`
  component) — not final copy. Do not replace placeholder text with
  invented marketing claims, especially on `/trust`, without explicit
  sign-off first.
- Live on Vercel already via direct deploy (project `ceo-elite-circle`).
  This repo is being connected as the permanent source so future changes
  go through git instead.

## Design reference in progress
A Behance case study ("Spectra Eye Clinic — UX/UI" by Margarita Kvasova —
tagged minimal, clean, corporate, medical) has been flagged as a layout/style
reference for a future redesign pass. Screenshots will be added to
`docs/design-reference/` when available — check there before starting any
visual redesign work.
