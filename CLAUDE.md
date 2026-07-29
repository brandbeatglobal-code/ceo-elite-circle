# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # next dev
npm run build    # next build — also the only type-check; there is no separate tsc script
npm run lint     # eslint (flat config, eslint-config-next)
npm start        # serve the production build
```

**There is no test framework.** No unit, integration or e2e suite exists, so there
is no "run a single test". Verification is done by driving the built site in a
headless browser — see *Verifying changes* below.

## What this is

A marketing site for CEO Elite Circle, a private membership organisation.
Next.js 16 App Router, React 19, Tailwind v4, TypeScript. Every route is static
(`generateStaticParams` for the dynamic ones); there is no database, no API
route, and no form submission — every form on the site is deliberately disabled.

`docs/brief.md` is the source of truth for design direction, copy rules and
page-by-page intent. Read it before changing anything visual or textual. It is
kept current; update it when you change a rule it documents.

## The content-honesty rule

This is the most load-bearing constraint in the repo and it is not optional.
The site is publicly reachable and carries **sample copy**, so:

- **Descriptive copy** — section intros, descriptions, benefits, criteria, FAQ
  answers — is written freely as design-stage text.
- **Verifiable claims are never invented**: named people, attributed quotes and
  testimonials, statistics and member counts, awards, dates and founding
  history, named partner organisations, prices and fees, and Trust Framework
  policy text. These stay as `<Placeholder>`.

Consequences that are easy to trip over:

- Sample copy contains **no numerals**, deliberately. A figure reads as a
  statistic even in draft.
- `/trust` carries **no sample copy at all** — its ten areas are commitments a
  member could rely on. Same for membership category entitlements.
- Anything stating what the Circle will or won't do with member information
  must point at the Trust Framework rather than state the policy.
- Several things are **deliberately empty and must stay so**: the four
  leadership cards on `/about`, the homepage testimonials, the About philosophy
  pull-quote, Expert Advisors on `/councils`, and the "article pending" cards
  on `/insights`. `docs/brief.md` § *What is still empty, and why* lists them
  with reasons.
- `/about/leadership/template` and `/insights/template` are real routes that
  are **deliberately linked from nowhere**. Do not link them.

## Architecture

### Pages are composed from section components

`src/app/**/page.tsx` files are thin: they assemble section-level components
from `src/components/` and pass content in. Almost no layout lives in a page
file. The shared primitives (`SectionHeader`, `PhotoFrame`, `Placeholder`,
`ArrowLink`, `PillButton`, `BulletLabel`, `Tone`) are in `src/components/ui.tsx`;
whole sections get their own file.

Most section components accept optional content and fall back to
`<Placeholder>` when it is absent — that is how a page stays complete and
honest before its copy exists.

### Section numbering must stay contiguous

Every section opens with a running index — "One", "Two", … from
`src/lib/ordinal.ts` — and each page numbers independently from One with no
gaps. Three idioms are in use, matched to the page:

- Fixed section lists: hardcoded `ordinal(0)`, `ordinal(1)`, …
- Pages built from an array: `ordinal(i)` in the map, then
  `ordinal(array.length)` for the closing section, so adding an item keeps the
  numbering correct automatically.
- Detail pages with conditional sections: a local counter,
  `let n = 0; const next = () => ordinal(n++)`, so a page that skips a section
  still runs One, Two, Three.

`RequestSection` is always the last section before the footer, and takes the
next number. `/contact` is the only page without one.

### Content lives in `src/lib/`

`pillars.ts`, `experiences.ts`, `leadership.ts`, `insights.ts` and `copy.ts`
hold the data the pages map over. Shared copy (membership categories) lives in
`copy.ts` so a homepage teaser and its full page cannot drift.

`leadership.ts` and `insights.ts` type every text field as `string | null` and
currently hold nulls — the templates render placeholders per empty slot, so
adding a real person or article is a data edit, not a template rewrite.
`insights.ts` also separates `articles` (includes the unlinked template) from
`published` (empty); the list page renders from `published`.

### Photographs

Singleton slots live in `src/lib/images.ts`; per-item photographs live on the
item in `pillars.ts` / `experiences.ts`. A `Photo` with `src: null` renders a
labelled "photography pending" frame rather than a broken image, so a missing
photograph reads as deliberate. Filling one is a one-line change.

`images.unsplash.com` is allow-listed in `next.config.ts`. **In a sandbox the
proxy blocks it (403)** — images will not render locally, and that is expected,
not a bug. It also means a wrong photo ID cannot be caught locally.

### `PhotoFrame` owns its `position`

Pass `cover` for a background photograph; never pass `relative`/`absolute` in
`className`. The two collide, and Tailwind resolves the conflict by stylesheet
order rather than by intent — which previously laid background photos out in
normal flow and pushed them off-screen.

### Motion

Content is **visible by default**. The inline script in `src/app/layout.tsx`
adds `js-anim` to `<html>` only when JavaScript runs *and* reduced motion is not
requested; every rule that hides anything is scoped to that class. So no JS and
reduced motion both mean nothing is ever hidden.

- Scroll reveal: server components emit `data-reveal` (plus an inline
  `transitionDelay` to stagger). `src/components/Reveal.tsx` observes them and
  marks each visible once. It also reveals anything already scrolled past when
  it attaches — an `IntersectionObserver` only fires on entry, so scroll
  restoration or a fast scroll during load would otherwise strand content
  invisible.
- Page transitions: `src/app/template.tsx` re-mounts per navigation, fades
  opacity only for 200ms, and **does not run on first load** (a module-level
  flag), so above-fold content does not animate twice.

When adding motion, keep the same contract: nothing may be hidden by default,
and reduced motion must skip it entirely.

### Closing forms

`RequestSection` takes a `variant` — one component, not copies. A governance
page and a briefings index must not both end in a membership application. The
route-to-variant map is in `docs/brief.md` § *Closing forms*. Rules: no field
implying a capability that doesn't exist (upload, scheduling, payment);
pre-filled context rendered inert rather than as an editable field; only the
two application variants may call themselves an application.

### Spacing

Rhythm is expressed through the Tailwind class scale, changed as a documented
mapping rather than per-page nudges (see `docs/brief.md` § *Spacing*).
**Do not change the Tailwind `--spacing` token** to adjust spacing — it drives
`w-*`/`h-*` as well as padding, so it resizes icon boxes and photo heights,
which is layout rather than spacing.

Heroes use `min-h-*`, never a fixed `h-*`. They are bottom-anchored
(`flex flex-col justify-end`), so a fixed height compresses the content stack
upward on a short viewport and pushes the headline behind the fixed nav.

## Verifying changes

Build and lint are necessary but not sufficient. Measurement and screenshots
catch different failures, and this repo has produced examples of both:

- A hero/nav overlap passed a **width** sweep while being visibly broken —
  height was the axis that mattered. For anything vertically anchored, sweep
  viewport height.
- The fixed draft notice covering the hero CTA was invisible in full-page
  captures, because fixed elements render at the capture origin rather than the
  viewport bottom. It needed a measured rect comparison.
- Blank sections in early captures were an artefact of photographing the
  scroll animation. **Capture with reduced motion**, or you photograph the
  animation instead of the page.

For any visual change: capture the affected pages at desktop and mobile, and
both states for anything hover-dependent. Chromium is at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; drive it with
`playwright-core` installed outside the project so `package.json` stays clean.

Worth re-checking after structural edits: section numbering contiguous per
page, exactly one `RequestSection` and it is last, no horizontal overflow at
390/768/1440, and the deliberately-unlinked routes still have no inbound links.

## The draft banner

`DraftBanner` is server-rendered so it is present without JavaScript — the
visitor with no other signal that the copy is provisional. Only the dismiss
button is a client component; dismissal is a `draft-dismissed` class on the
document element, re-applied before paint by the inline script.

Removing it at launch: delete `DraftBanner`, `DismissDraftBanner`, their mount
in `layout.tsx`, and the `.draft-banner` / `.hero-foot` rules in `globals.css`.
That is the whole removal.
