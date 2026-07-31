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

### Environment

Five variables, none of which has a fallback that guesses. The public site
needs none of them; they are all the admin's.

| Variable | Default | Unset |
| --- | --- | --- |
| `ADMIN_PASSWORD` | none | every `/admin` route, login included, serves the site's 404 |
| `GITHUB_TOKEN` | none | the panel renders from the deployment's own copy with a visible note, and every save refuses with a message rather than silently doing nothing |
| `GITHUB_REPO` | `brandbeatglobal-code/ceo-elite-circle` | — |
| `GITHUB_BRANCH` | `main` | — |
| `GITHUB_API_BASE` | `https://api.github.com` | — |

The two secrets are set only in Vercel's dashboard, never in the repo, and a
redeploy is needed to pick either up. The token is a fine-grained PAT scoped to
this repository with Contents: read and write and nothing else.

Locally, `ADMIN_PASSWORD` alone gets you into the panel and is enough for
anything read-only. To exercise a *save* without touching the real repository,
point `GITHUB_API_BASE` at a stand-in API and set any non-empty `GITHUB_TOKEN`
— that is how the commit path was checked. `GITHUB_REPO`/`GITHUB_BRANCH` exist
for the same reason and should not be set in production.

## What this is

A marketing site for CEO Elite Circle, a private membership organisation.
Next.js 16 App Router, React 19, Tailwind v4, TypeScript. Every route is static
(`generateStaticParams` for the dynamic ones); there is no database, no API
route, and no form submission — every form on the site is deliberately disabled.

Three documents, and it matters which one you reach for:

- `docs/brief.md` — the source of truth for design direction, copy rules and
  page-by-page intent, plus the verification methods and the running status
  log. Read it before changing anything visual or textual. It is kept current;
  update it when you change a rule it documents.
- `docs/content-inventory.md` — the field-by-field record of which content key
  feeds which part of which page. The spec to read before changing the schema.
- `docs/design-reference/` — **deliberately empty** (a `.gitkeep`). The eleven
  layout reference screenshots are a third party's published work and are not
  committed; `docs/brief.md` § *Design reference* names the source. The
  directory is not a missing asset to go and find.

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

### The admin panel (Phases 2–4 — login, shell, text editing, image upload)

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
from the public site. See § *Environment* for what to set to run one locally.

#### Editing (Phase 3)

One field, one form, one save. Saving validates server-side, commits the whole
file to `main` via the GitHub Contents API, and lets the existing Vercel deploy
publish it — so every edit is a real commit with history, and the confirmation
says "about a minute" rather than implying it is already live.

**`src/lib/admin/schema.ts` is the one place that says how a field behaves** —
editable or not, clearable or not, and what clearing it would do. The form and
the validator both read it, so a field can never be rendered as editable and
then rejected on save. Rules match on `file:path` with array indices collapsed
to `*`.

`src/lib/admin/validate.ts` is deliberately paranoid, because the client edits
without review and a bad value breaks the production build. In order: the path
must resolve to a leaf that already exists; the leaf must be a string or null
(never an object, array, or photograph); the value is length- and
control-character-checked; empty is only allowed where the rule says nullable;
slug fields must be `^[a-z0-9-]+$`; link fields must be a single-slash site
path (`//host` is protocol-relative and would leave the site). Then the
backstop — **the file's whole shape after the
edit must be identical to its shape before at every other position**, and the
serialised bytes must re-parse to exactly what was validated. Nothing reaches
GitHub until all of that passes.

Ordering in the save action matters: **commit first, write locally second.**
GitHub is the source of truth and local state must never run ahead of it. On
Vercel the local write simply fails (read-only filesystem) and that is fine —
the deploy is what brings the new content.

#### What an edit is applied to

**The repository, read at the moment of saving — never this server's copy of
`content/`.** `src/lib/admin/content.ts` is the only place that decides this,
and both server actions go through it.

The distinction is not academic; getting it wrong lost real work. On Vercel
the deployed bundle's `content/` is a snapshot taken when the deployment was
built, and a save takes about a minute to redeploy. For that minute the
running server's own copy is *behind the repository*. An edit applied to that
snapshot and committed as a whole file silently reverts anything committed
since — which is what happened when two photographs were uploaded seconds
apart: the second upload landed correctly and rolled the first one back
(`55544a8`, then `d0868d3`).

So: `registry.ts` reads the filesystem, and that is right for discovering
*what exists* — the section list, the field walk, the shapes, which cannot
change without a code change. It is wrong for *values*. `editBase()` fetches
the file from the branch at a pinned commit and refuses the save outright if
it cannot; there is no fall back to the snapshot, because guessing is what
caused the bug. The panel reads live too (`displayContent()`), so it never
invites an editor to save back a value that has already been replaced; that
one *does* fall back to the deployment's copy, with a visible note, since
display cannot lose anyone's work.

Two writes, two concurrency guards, both fail closed with "reload and try
again":

- a text save is a compare-and-swap on the blob sha the edit was read from
  (the Contents API refuses a stale sha);
- a photo save builds its tree on the commit the read was pinned to, so the
  non-forced ref update refuses if the branch moved.

The regression test for all of this is the two-save sequence described in
`docs/brief.md` § *Verification*. A single-edit test passes against the broken
code.

#### One-time maintenance, and why there is none now

There was briefly a route at `admin/(panel)/maintenance/brightness` that filled
in `photo.brightness` for the slots filled by hand at design stage. It ran once
(`093f255`, `83b4764`, `cf2c899` — results recorded in `docs/brief.md`) and was
deleted, which was the plan from the moment it was written.

Worth keeping the shape of it in mind if a similar job comes up: it wrote
through `editBase` and `validatePhotoEdit` exactly like any other save, rather
than editing `content/` directly, so a one-off script got the same shape
backstop and the same compare-and-swap as the admin itself. A maintenance job
is the *worst* place to bypass those, because nobody is watching it field by
field. And it was a page rather than a script because the work needed
production's network and production's token; running it anywhere else could not
have reached the images.

Deferred: adding or removing whole array entries, and creating a key that is
currently absent. Both change a file's shape, which is exactly what the
validator refuses. Six form variants have no `ctaHref` key at all, so the admin
cannot make those buttons live — which is the safe direction.

`content/*.json` is stored in exactly the format `JSON.stringify(data, null, 2)`
produces, plus a trailing newline. Keep it that way: a save rewrites the whole
file with that serialiser, so any hand-formatting would be destroyed on the
first edit and show up as a huge diff.

Testing the commit path needs no real token: `GITHUB_API_BASE` points the
client at a stand-in API (see the Phase 3 verification), which is how the
request shape was checked without writing to the repository.

#### Image upload (Phase 4)

A photo, its alt text and its note are edited **together, as one unit**
(`PhotoEditor`) — alt text describes the image that is actually there, so it
is never unlocked separately. The in-slot preview renders at the slot's real
proportions with `object-cover` (ratios per slot in `schema.ts`'s `PREVIEWS`;
multi-use slots get a frame per treatment), so a bad crop is visible before
saving. Clearing a slot returns it to the labelled pending frame — the JSON
deep-equals a never-filled slot.

Nothing about an upload is trusted (`src/lib/admin/images.ts`): format is
decided by **magic bytes** (never extension or MIME), the set is JPEG / PNG /
WebP / HEIC only, and everything is decoded and re-encoded through sharp —
which applies EXIF orientation and strips metadata, including the GPS
coordinates a phone photo would otherwise carry into a public repo. HEIC
(iPhone default) converts to JPEG via a WASM libheif decode, because sharp's
prebuilt binaries lack HEIF; `heic-decode`/`libheif-js` are in
`serverExternalPackages`, without which the tracer sweeps the whole project
into the bundle. Stored filenames are generated (slot slug + content hash) —
an uploaded filename is never used. Uploads land in `public/uploads/`.

The image file and the JSON pointing at it go to GitHub **in one commit**, via
the Git Data API (`commitFiles` — the Contents API can only touch one file per
commit); replacing or clearing an upload deletes the old file in that same
commit, but only paths matching `isOwnUpload` — Unsplash slots have nothing
local to clean up. Client-side the browser resizes/re-encodes before sending
where it can decode (HEIC on desktop passes through raw, with an honest
no-preview note); `serverActions.bodySizeLimit` is raised for that raw case.
In production a freshly saved image is not servable until its deploy lands —
the editor shows a labelled "preview appears once the deploy finishes" frame
rather than a broken image, and `next start` behaves the same way locally for
files added after startup.

### Pages are composed from section components

`src/app/**/page.tsx` files are thin: they assemble section-level components
from `src/components/` and pass content in. Almost no layout lives in a page
file. The shared primitives (`SectionHeader`, `SectionShell`, `PhotoFrame`,
`Placeholder`, `ArrowLink`, `PillButton`, `BulletLabel`) are in
`src/components/ui.tsx`, along with the `Tone` union and the two functions
every primitive in that file derives its own light/dark treatment through,
`isDark()` and `hair()`. So a page passes a `tone` and never passes colours —
add a primitive and it should read the tone the same way rather than branch on
its own. Whole sections get their own file.

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
and numbering, tone/`flip`/grid props, and route paths.

With one exception worth knowing before you touch an array: **the four dynamic
routes are generated from content.** `generateStaticParams` maps
`pillars`/`experiences`/`insights.articles`/`leadership` to slugs, and each
page `notFound()`s a slug that is not in its array. So adding an entry adds a
static route, and renaming a `slug` silently moves a live URL — it still
builds, because the route list is regenerated from the array; the old address
just starts returning the 404.

Adding or removing an entry changes the file's shape, which the validator
refuses, so the admin cannot do that. **Renaming one it can**, deliberately —
renaming a page before launch is a real thing to want, so `schema.ts` gives
`slug` its own `kind` and a `structural` note rather than blocking the field.
Nothing inside the site breaks: every internal link is built from `.slug` and
follows it. What does not follow is anything outside the site, which is what
the note says.

`kind: "slug"` also constrains the *shape* of the value — `^[a-z0-9-]+$`,
refused at save time with a message naming the allowed characters. This is the
one field where a merely ugly value is a real defect: a capital or a space
still builds and still routes, it just produces an address that cannot be
typed, said aloud or pasted back reliably, and that some clients percent-encode
and others do not.

One slug is load-bearing beyond its own URL. `homepage.json`'s
`experiences.featuredSlug` selects the featured experience by
`experiences.find(…)!` in `(site)/page.tsx` — a non-null assertion, so a value
matching no experience is not a 404 but a homepage that **fails to build**.
Renaming the featured experience's slug and editing `featuredSlug` are
therefore one edit in two places; both fields carry a note saying so.

### Icons

`src/components/Icons.tsx` holds sixteen marks, and **each one carries a
written meaning above its definition**. That is what makes an assignment
checkable: a mark is chosen because it says what its label says. Reuse across
sections is fine where the concepts really are the same; what is not fine is
the same sequence appearing under unrelated words, which is what four marks
spread over sixteen sections produced.

**Every icon is named by content, resolved by the component** — `"icon": "…"`
in the JSON, `Icon` in `Icons.tsx` looks it up. `CandidacyChecklist` used to
hardcode a positional array instead, so all thirteen candidacy sections showed
the same four shapes in the same order whatever their criteria said. There is
now one pattern, not two.

The key is design rather than copy, so the admin shows it read-only
(`kind: "icon"` in `schema.ts`) and `validateEdit` refuses it: a key outside
the set is a page with no mark to resolve. `Icon` also falls back to `rings`
for an unknown key rather than throwing, because a wrong mark is a far better
failure than a page that will not render.

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
image, so a missing photograph reads as deliberate. Slots are filled through
the admin's photo editor (uploads land in `public/uploads/`), or by hand as a
one-line edit; several slots still carry Unsplash URLs from the design stage.

`images.unsplash.com` is allow-listed in `next.config.ts`. **In a sandbox the
proxy blocks it (403)** — images will not render locally, and that is expected,
not a bug. It also means a wrong photo ID cannot be caught locally.

### Text over a photograph is never calibrated to the photograph

Every full-bleed photo section uses the scrim classes in `globals.css`, not a
flat `bg-black/NN`: a wash on the section so the picture reads, plus a heavier
field on the copy itself, feathered in over the container's own padding. A
flat overlay dark enough to survive a white photograph behind text leaves the
photograph invisible everywhere else, which is why the field belongs to the
copy rather than to the section.

**Both alphas are computed from the photograph, not fixed.** `scrimVars()` in
`src/lib/images.ts` reads `photo.brightness` — measured on upload — and solves
for the pair that brings the background behind the copy to 0.081 luminance,
about 8:1 for white text. That ceiling is absolute, so the guarantee is the
same for every image, but what it costs the picture is not: a white photograph
gets 0.42 and 0.86 (the measured worst case, unchanged), while the homepage's
night skyline at brightness 0.369 gets 0.35 and 0.66 and keeps 2.7× more of
itself. Two layers each calibrated for a white photograph compound to ~0.92
where they overlap, which is most of a hero — that is what crushed the
skyline, and why the ceiling is enforced on the composite rather than on each
layer.

`brightness: null` means unmeasured — an Unsplash slot, or anything stored
before this existed — and is treated exactly as a white photograph. Guessing
light on an unknown image is the one failure that puts unreadable text on the
page.

Three consequences worth knowing before editing one of these sections:

- `.copy-scrim`'s gradient stops track the container's `pt-36` / `lg:pt-44`.
  Change one and change the other, or the field starts in the wrong place.
- Nothing over a photograph may be dimmer than 75% white. `Placeholder` takes
  `onPhoto` for that; 55% white clears 4.5:1 on the ramp but not here.
- **No photograph, no scrim** — each component checks `photo.src` and skips
  both classes. An empty slot is the dark ramp with a labelled pending frame,
  and a field would only bury the frame's own label. The classes are
  background-only or padding-and-negative-margin balanced, so dropping them
  moves nothing.

Verify by measurement against a deliberately high-key image, not by reading
the CSS — `docs/brief.md` § *Verification* describes the method and the three
traps in it.

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
