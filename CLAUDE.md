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

### Route groups: `(site)` vs `/admin`

The root layout carries only fonts, `globals.css` and the motion flag. The
public site's chrome — nav, footer, back-to-top, draft banner — is
`SiteChrome`, mounted by `(site)/layout.tsx`; every public page lives under
`src/app/(site)/`. `/admin` shares the root layout (so it stays on-system)
but not the marketing shell.

The root `not-found.tsx` mounts `SiteChrome` itself, deliberately: a URL that
matches no route never enters the `(site)` segment, so without that the 404
would render bare with no way back in. `notFound()` thrown anywhere — an
unknown slug, the admin when unconfigured — lands on the same page.

The body's banner-clearing `padding-bottom` is scoped with
`body:not(:has(.draft-banner))` so documents without the notice (the admin)
don't carry it; browsers without `:has()` keep the padding everywhere, which
is the old behaviour.

### The admin panel (Phase 2 — login and read-only shell)

`/admin` is the content admin. Access model, in order:

- **`ADMIN_PASSWORD` unset → every admin route (login included) serves the
  site's 404.** This is the safe default and the state immediately after a
  deploy; the variable is set only in Vercel's dashboard (a redeploy is
  needed to pick it up), never in the repo, and there is no fallback value.
- One shared password, compared server-side with a timing-safe hash compare
  (`src/lib/admin/auth.ts`). Failures get one generic message and a growing
  per-IP delay (in-memory, per server instance — accepted for a one-editor
  admin).
- Sessions are a signed cookie, `<expiresMs>.<hmac>`, verified on every
  request; no session store. httpOnly, secure, SameSite=Lax, `Path=/admin`,
  24h. The signing key is derived from the password, so changing the password
  signs everyone out.
- Every page under `admin/(panel)` calls `requireAdmin()` itself — a layout
  does not re-run on navigation between its own children, so pages are the
  gate and the layout's call is defence in depth.

The section list is **derived from the `content/` directory at request time**
(`src/lib/admin/registry.ts`), not hand-maintained: files are discovered with
`readdir`, sections are each file's top-level keys, and `ValueView` renders
any shape read-only. A thirteenth content file appears in the admin without
code changes (`KNOWN` in the registry is display polish only). Phase 3's
forms bind to the same walk. `outputFileTracingIncludes` in `next.config.ts`
ships `content/**` with the admin's server bundle — without it the JSON would
be missing from the deployed functions.

Admin pages are `force-dynamic`, carry `robots: noindex`, and are not linked
from the public site. To run locally: set `ADMIN_PASSWORD` in the server's
environment for that run.

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

### Content lives in `content/*.json`

Every editable string and image on the site is in one of twelve JSON files
under `content/` — one per page, plus `site.json` (metadata, nav, footer, draft
banner) and `forms.json` (the `RequestSection` variants), both of which belong
to no single page. `docs/content-inventory.md` is the field-by-field record of
what moved where, and is the spec to read before changing the schema.

`src/lib/*.ts` are now **thin typed loaders**, one per content file: import the
JSON, declare its type, export it. No defaulting, no merging, no computation —
so changing a value in `content/` changes the rendered page and nothing else.
That is what makes the Phase 2+ admin panel a file edit rather than a code
change. Keep them thin.

Structure stays in code and is deliberately *not* in the JSON: section order
and numbering, tone/`flip`/grid props, route paths, and which icon sits above a
feature label (the JSON names an icon by key; `Icon` in `Icons.tsx` resolves
it).

Membership categories live only in `content/membership.json`; the homepage
teaser reads them from there, so a teaser and its full page cannot drift. An
admin editing the homepage will not find category copy under `homepage.json` —
that is correct, not an omission.

`leadership.json` and `insights.json` type every text field as `string | null`
and currently hold nulls — the templates render placeholders per empty slot, so
adding a real person or article is a data edit, not a template rewrite.
`insights.json` also separates `articles` (includes the unlinked template) from
`published` (empty); the list page renders from `published`.

`trust.json` deliberately has **no field for policy text** — only the ten area
names. The schema itself makes the no-sample-copy rule hard to break by
accident, including from the admin panel.

### Photographs

Photo slots live on the page or item they belong to, in that section's JSON
file. `src/lib/images.ts` holds only the `Photo` type. A `Photo` with
`src: null` renders a labelled "photography pending" frame rather than a broken
image, so a missing photograph reads as deliberate. Filling one is a one-line
edit to the JSON.

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
variants themselves are in `content/forms.json`; the route-to-variant map is in
`docs/brief.md` § *Closing forms*. Rules: no field
implying a capability that doesn't exist (upload, scheduling, payment);
pre-filled context rendered inert rather than as an editable field; only the
two application variants may call themselves an application.

**A variant's CTA renders as a link only when `ctaHref` is set**, and it is set
only where the destination does what the label promises. Everything else
renders a disabled button, like the fields. This matters more than it looks: a
disabled field is visibly unfinished, but a working button that navigates
somewhere other than what it offered gives no such signal. Today only the
membership and application variants have a real destination (`/contact`).

### Spacing

Rhythm is expressed through the Tailwind class scale, changed as a documented
mapping rather than per-page nudges (see `docs/brief.md` § *Spacing*).
**Do not change the Tailwind `--spacing` token** to adjust spacing — it drives
`w-*`/`h-*` as well as padding, so it resizes icon boxes and photo heights,
which is layout rather than spacing.

Heroes use `min-h-*`, never a fixed `h-*`. They are bottom-anchored
(`flex flex-col justify-end`), so a fixed height compresses the content stack
upward on a short viewport and pushes the headline behind the fixed nav.

They also subtract the draft notice from the height they claim —
`min-h-[calc(100svh-var(--banner-h))]` — so bottom-anchored content is never
placed underneath the fixed bar. `--banner-h` drops to `0rem` under
`.draft-dismissed` and goes with the banner at launch. Note that padding cannot
substitute for this: once hero content overflows the box, `justify-end` has no
free space and padding below the CTA does not move it up.

## Verifying changes

Build and lint are necessary but not sufficient. Measurement and screenshots
catch different failures, and this repo has produced examples of both.

Two harness traps that have already cost time here, both of which produced
*confident wrong answers* rather than obvious failures:

- **`next start` does not rebind a port that is already held.** Rebuilding
  `.next` under a still-running server leaves it serving an old build manifest:
  chunks 404/500, React never hydrates, and every client component looks
  broken. Kill the old process and confirm the port is free before capturing.
- **Failed images paint their alt text**, and *when* the failure lands decides
  whether that text is on screen at capture time. That reads as a page diff but
  is a network diff. Stub the image route — and note that `next/image` requests
  `/_next/image?url=…` from our own server, so `images.unsplash.com` is the
  wrong URL to intercept.

For a content refactor specifically, the strongest check is not a screenshot at
all: `next build` writes the prerendered HTML to `.next/server/app/**.html`, so
before/after copies of that tree can be diffed byte-for-byte once `<script>`,
`<link>` and HTML comments are stripped (build-id chunk hashes and React's text
separators are the only legitimate differences).

The failures that needed the other methods:

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
in `SiteChrome.tsx`, and the `.draft-banner` / `.hero-foot` rules plus the two
`body` padding rules in `globals.css`. That is the whole removal.
