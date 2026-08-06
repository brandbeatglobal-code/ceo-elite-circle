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

Seven variables, none of which has a fallback that guesses. Five are the
admin's; two are the forms'.

| Variable | Default | Unset |
| --- | --- | --- |
| `ADMIN_PASSWORD` | none | every `/admin` route, login included, serves the site's 404 |
| `GITHUB_TOKEN` | none | the panel renders from the deployment's own copy with a visible note, and every save refuses with a message rather than silently doing nothing |
| `GITHUB_REPO` | `brandbeatglobal-code/ceo-elite-circle` | — |
| `GITHUB_BRANCH` | `main` | — |
| `GITHUB_API_BASE` | `https://api.github.com` | — |
| `RESEND_API_KEY` | none | every form refuses to send, with a message saying so — never a false confirmation |
| `RESEND_API_BASE` | `https://api.resend.com` | — |

The three secrets are set only in Vercel's dashboard, never in the repo, and a
redeploy is needed to pick any of them up. The GitHub token is a fine-grained
PAT scoped to this repository with Contents: read and write and nothing else.
`RESEND_API_KEY` is read only inside `src/lib/mail.ts`, which is `server-only`,
so it cannot reach a client bundle even by accident.

Locally, `ADMIN_PASSWORD` alone gets you into the panel and is enough for
anything read-only. To exercise a *save* without touching the real repository,
point `GITHUB_API_BASE` at a stand-in API and set any non-empty `GITHUB_TOKEN`
— that is how the commit path was checked. `GITHUB_REPO`/`GITHUB_BRANCH` exist
for the same reason and should not be set in production. `RESEND_API_BASE`
plays exactly the same role for the forms: point it at a stand-in and set any
non-empty `RESEND_API_KEY`, and every send is recorded rather than delivered.

## What this is

A marketing site for CEO Elite Circle, a private membership organisation.
Next.js 16 App Router, React 19, Tailwind v4, TypeScript. Every public route is
static (`generateStaticParams` for the dynamic ones) and there is no database
and no API route. Forms are the one exception and are no longer inert: all nine
post to a single server action which sends the submission as email through
Resend — see § *Closing forms*. Nothing is stored; the inbox is the record.

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
- `/trust` carries **no sample copy, and now carries signed-off policy text
  instead.** Its ten areas were empty for most of this project because a
  commitment reads as binding whether or not the wording is finished; they were
  signed off by the founder and published, so the rule became "do not edit
  these" rather than "do not draft these". Do not tidy them for rhythm, shorten
  them to fit, or rephrase them into the site's voice. Membership category
  entitlements are still in the no-sample-copy state.
- Anything stating what the Circle will or won't do with member information
  must point at the Trust Framework rather than state the policy.
- **Expert Advisors on `/councils` is deliberately empty and must stay so.** It
  needs a real named person, which is what the outreach is for. `docs/brief.md`
  § *What is still empty, and why* lists it with the reason.
- **The homepage testimonials are real now**, and were empty for most of this
  project for the same reason. Three quotations supplied by the Circle from
  members who agreed to be quoted but **not to be named**, so each is
  attributed by role and industry only ("CEO, Heavy Manufacturing"). That is a
  narrower thing than the rule originally anticipated, and the distinction
  matters: an anonymised attribution is still a real member's real words, and
  it is still not something to invent, edit for rhythm, or extend. Adding a
  fourth would need a fourth member.
- **A slot's styling follows its content, never the other way round.** Real
  words get real treatment — serif, full strength, no dashed border; only a
  genuinely empty slot gets the labelled placeholder. Every slot that can hold
  real content is written `value ? <real> : <Placeholder>`, and a new one must
  be too.

  This is a rule because it broke. A real pull-quote was typed into the About
  philosophy slot's `quoteNote` — the sentence shown *inside* the empty frame,
  a brief for whoever fills it — and rendered as a placeholder: dashed border,
  muted italic, reading as unfinished while being finished. The slot now has
  its own `quote` and `quoteAttribution` fields, and `schema.ts` marks every
  `*Note` field in the admin as the empty-state text rather than the content.

  Where a quote is real but its attribution is not, the quote renders properly
  and the *name* keeps its pending frame. Half-finished is shown as
  half-finished; it is not rounded up to done or down to empty.
- **The three About leadership cards are the exception, and are now real.**
  Three named people with real titles and real credentials, supplied by the
  Circle. They are the one place on the site where a text field is a factual
  claim about a person, so nothing in them is rewritten for voice, shortened
  for rhythm, or filled in by inference — including the numeral in "25+
  years", which the no-numerals rule below does not reach because it is not
  sample copy. Their photo slots stay empty, each pending frame labelled with
  whose headshot belongs in it.
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
validator refuses.

`content/*.json` is stored in exactly the format `JSON.stringify(data, null, 2)`
produces, plus a trailing newline. Keep it that way: a save rewrites the whole
file with that serialiser, so any hand-formatting would be destroyed on the
first edit and show up as a huge diff.

Testing the commit path needs no real token: `GITHUB_API_BASE` points the
client at a stand-in API (see the Phase 3 verification), which is how the
request shape was checked without writing to the repository.

#### Image upload (Phase 4)

A photo, its alt text, its note and — where the section carries words over the
picture — its text colour are edited **together, as one unit** (`PhotoEditor`)
— alt text describes the image that is actually there, so it is never unlocked
separately.

The text-colour control is two buttons, not a picker, and it appears only on
the slots `textOverPhoto()` in `schema.ts` names, each with a sentence saying
what that one value governs. A leadership portrait carries the field in its
JSON and gets no control: offering one that changes nothing is worse than not
offering it. Beside it sits an estimated contrast ratio against the actual
photograph — information, never a block, and explicit that it reads the
brightest area, which is the worst case for white copy and the best case for
ink. The in-slot preview renders at the slot's real
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

**And they render through one component, `CategoryRows`, for the same reason.**
Sharing the content was never enough: `/membership` and the homepage teaser
each had their own copy of the markup, so when the category name was moved into
the left column on one, the other kept the old shape and the two drifted
visibly. What legitimately differs is passed in — the `tone`, and the link each
page's rows carry (`/membership` points at the application form, the homepage
points at `/membership`) — and colours are never passed, only derived from the
tone through `isDark()` and `hair()`, like every other primitive here.

`leadership.json` types every text field as `string | null` and holds nulls —
the profile template renders a placeholder per empty slot, so adding a real
person there is a data edit rather than a template rewrite.

`insights.json` holds every article in `articles`, and **`published` is a list
of slugs** naming the ones the index links. That is what makes an article
public: the structural template is in `articles` and not in `published`, which
is exactly why it is reachable directly and linked from nowhere. Slugs rather
than a second copy of the article, because two copies drift and the admin only
ever edits one of them.

An article's `body` is a `sections` array — heading, paragraphs, and an
optional bulleted list — not the fixed opening/list/closing slots it started
as. The first real article ran to four prose sections and no list, which the
old shape could not carry without inventing bullet points. `note` and
`pullQuote` are nullable for the same reason: they are slots the design offers,
not things every piece arrives with.

`trust.json` **now has a `body` on each of the ten areas**, and did not until
the wording was signed off — the absence of the field was the guardrail, and it
was satisfied rather than removed. See § *The content-honesty rule* for what
replaced it.

### Photographs

Photo slots live on the page or item they belong to, in that section's JSON
file. `src/lib/images.ts` holds the `Photo` type, the scrim maths and
`photoText()`. A `Photo` with `src: null` renders a labelled "photography
pending" frame rather than a broken image, so a missing photograph reads as
deliberate. Slots are filled through
the admin's photo editor (uploads land in `public/uploads/`), or by hand as a
one-line edit; several slots still carry Unsplash URLs from the design stage.

`images.unsplash.com` is allow-listed in `next.config.ts`. **In a sandbox the
proxy blocks it (403)** — images will not render locally, and that is expected,
not a bug. It also means a wrong photo ID cannot be caught locally.

### Text over a photograph: the mode decides, the scrim helps

Two mechanisms, and the split matters. **`photo.textMode` chooses the copy
colour per slot** — `light` (white) or `dark` (`--color-ink`, the near-black
olive used on cream; never pure black). **The scrim is a light touch on top**,
not the legibility guarantee it used to be.

It used to be exactly that: solved to hold the background behind the copy at
0.081 luminance whatever the image, which on a bright photograph meant a 0.42
wash plus a 0.86 field composing to 0.92 — a dark rectangle where a photograph
should be. Reversing that was the point of the change, not a side effect.

`photoText(photo)` in `src/lib/images.ts` is the single source for a section's
colours, and **one call feeds the whole section**: headline, body, the CTA
pill's variant, the hairline grid — and the nav, on the two routes where it is
transparent over a hero. `Nav` takes a `heroTextModes` map from `SiteChrome`
(a server component, so `home.json`/`about.json` stay out of the client
bundle) instead of hardcoding white; hardcoded white is precisely how a
dark-mode hero would strand white links on a pale photograph. Do not colour a
photo-backed element by hand — take it from `photoText`, or the section will
end up half in one mode.

`Photo.textMode` is typed `string`, not the `TextMode` union, and that is
deliberate: the loaders in `src/lib/*.ts` assign the imported JSON straight to
each page's content type, and that assignment is the whole-file structural
check the build depends on. A JSON import widens `"light"` to `string`, so a
narrower type would force a cast in seven loaders and throw the check away.
Every reader goes through `storedMode()`/`activeMode()`, which treat anything
that is not `dark` as light — the same forgiveness `Icon` gives an unknown
mark, in the same safe direction. The two values are enforced where it counts,
in `validatePhotoEdit`.

`scrimVars()` still solves both alphas from `photo.brightness`, and now also
from the mode:

- Light copy holds the brightest region at or below 0.26 luminance — about
  **3.4:1** for white text, short of AA on purpose. Dark copy lifts it to at
  least 0.62, about 6.8:1 for ink. Mirror images about mid-grey.
- Floor 0.15, cap 0.5: never completely unprotected, never bleached.
- **The scrim's colour follows the mode** — black under white copy, white
  under ink. A black wash under ink copy is a control fighting itself. The
  variables hold whole colours rather than alphas for that reason, plus
  `--scrim-clear` so a gradient fades to its own hue instead of through the
  grey `transparent` would give.
- **Solved in sRGB channel space, not by multiplying a luminance.** That is
  where a browser composites an overlay. The old code multiplied the measured
  luminance directly, which overstates an overlay's effect by roughly an order
  of magnitude — part of why the result was so heavy.

`brightness: null` means unmeasured and is treated as a white photograph.
Guessing light on an unknown image is the one failure that puts unreadable
white text on the page. Note what the number is, though: the brightest
*region*. That is the worst case for white copy and the **best** case for ink,
so the admin's contrast estimate is a floor in light mode and a ceiling in
dark mode, and it says so. Nothing stored knows how dark a picture's dark
parts are; if dark mode gets used much, a darkest-region measurement is the
next thing to add.

Consequences worth knowing before editing one of these sections:

- `.copy-scrim`'s gradient stops track the container's `pt-36` / `lg:pt-44`.
  Change one and change the other, or the field starts in the wrong place.
- Nothing over a photograph may be dimmer than 75% white, or 80% ink.
  `Placeholder` takes `onPhoto` for that, on both sides: 55% white clears
  4.5:1 on the ramp but not here, and olive is the same case on cream.
- **No photograph, no scrim, and no dark mode** — each component checks
  `photo.src` and skips both classes, and `activeMode()` forces light. An
  empty slot is the dark ramp with a labelled pending frame; a field would
  only bury the frame's own label, and ink on the ramp would be invisible.
- `PhotoCard` is on the same variables, but its **copy colour switches on the
  selectors the image fades on** (`.photo-card-ink` plus the `hover` /
  `hover: none` queries), because off hover there is no photograph — only the
  black section the card sits in. That is also why the card's copy takes its
  colour from CSS custom properties rather than a `tone`: there is no single
  answer for the life of the component. `ArrowLink` grew an `inherit` prop for
  the same reason.

Verify by measurement against a deliberately high-key image, not by reading
the CSS — `docs/brief.md` § *Verification* describes the method and the traps
in it, including that a Tailwind colour and a hand-written `rgba()` cannot be
string-compared.

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
- The experiences panel's photo cross-fade (`.exp-photo`, 260ms) needs no
  reduced-motion branch of its own: the `prefers-reduced-motion` block at the
  foot of `globals.css` already collapses every transition to 0.01ms. Prefer a
  plain CSS transition for this reason — a JS-driven animation would have to
  re-implement that check.

When adding motion, keep the same contract: nothing may be hidden by default,
and reduced motion must skip it entirely.

### The homepage experiences panel

`ExperienceShowcase` is a client component because the panel has state; the
section around it stays server-rendered.

**Two layers, so it works with a pointer, a finger and a keyboard.** Hover
previews and releases on leave; click or tap pins until something else takes
over. Touch has no hover, so the pin is what makes it usable there.
`onFocus`/`onBlur` bubble from each row's own "Discover" link, so tabbing the
list drives the panel exactly as hovering does — a hover-only version would be
invisible to a keyboard.

**All seven photographs render, stacked, and cross-fade on opacity.** Swapping
a single `src` would fetch on demand and flash the first time each is shown.
Stacked, they load together when the section nears the viewport and the swap is
then a property change. If a photograph is ever added here, it joins the stack;
the cost is seven images on the homepage, which is the price of no flash.

The links are untouched by the interaction — a row's link and the featured link
are ordinary navigation. The featured one carries an `ariaLabel` naming the
occasion, because its destination moves with the panel and "Discover the
Circle" alone would not say where it goes. That label begins with the visible
text, so the accessible name still contains it.

### Closing forms

`RequestSection` takes a `variant` — one component, not copies. A governance
page and a briefings index must not both end in a membership application. The
variants themselves are in `content/forms.json`; the route-to-variant map is in
`docs/brief.md` § *Closing forms*. Rules: no field
implying a capability that doesn't exist (upload, scheduling, payment);
pre-filled context rendered inert rather than as an editable field; only the
two application variants may call themselves an application.

**They send.** The eight variants plus `/contact`'s own form are nine kinds
posting to one server action, `src/app/(site)/submit.ts`, which emails the
submission through Resend. `ctaHref` is gone: it existed because the CTA was
either a link somewhere else or a dead button, and now every variant's button
submits its own form, which is the thing it always said it would do.

Four files, and the split is the point:

- `src/lib/mail.ts` — the Resend call and the two named constants,
  `FORM_RECIPIENT` and `FORM_SENDER`. `import "server-only"` at the top, so a
  client import is a build error rather than a leaked key. Everything lands at
  one address because Resend has no verified sending domain for this project
  yet; splitting it per form later is a change to that constant and nothing
  else, which is why the subject line carries the form's identity. It is
  transport only — it takes an `html` and a `text` and posts both, so every
  message goes out as multipart/alternative.
- `src/emails/FormSubmission.tsx` — **one template for all nine forms**, built
  on `@react-email/components`. See § *The notification email* below.
- `src/lib/formSpec.ts` — **the one place saying how a named field behaves**:
  its input type, whether it is required, and the options if it is a select.
  The renderer and the server-side validator both read it, so a field can never
  be offered and then rejected as unknown, or accepted having never been shown.
  Same discipline as `admin/schema.ts`. The subject-line map lives here too.
- `src/app/(site)/submit.ts` — the action. Nothing from the browser is trusted:
  the field list comes from `formSpec`, not from the submitted form, so a value
  under a name this form does not have is dropped rather than forwarded — the
  inbox cannot be used as a relay for arbitrary text. Length cap, control-
  character refusal, required fields, a deliberately loose email check, and a
  select may only carry an option it was actually offered. An off-screen
  honeypot answers as though it sent, so a bot learns nothing.
- `src/components/RequestForm.tsx` — the only client component in the path. It
  renders the fields and the three honest states: sending, sent, and failed.
  **A failure never reads as a success**, and the unconfigured case says the
  site cannot send rather than pretending.

Two behaviours worth knowing before editing it. A refusal hands the visitor's
answers back and remounts the fields carrying them (`attempt` as a `key`) —
React clears an uncontrolled form once its action completes, which is right
after a send and wrong after a refusal, and without this the form empties the
field it has just asked someone to correct. And a dropdown only exists where a
real list of answers does; every other `<select>` in the design carried exactly
one `<option>` holding the field's own label, which is an unusable control
implying a taxonomy that does not exist, so those render as text fields. The
lists themselves come from two places, and which one is a decision:
`formSpec.ts` reads them from content where the site already publishes them
(membership categories, framework areas, councils) and holds them literally
where they are a fixed taxonomy nothing displays (region, referral type, and
so on).

#### The notification email

`src/emails/FormSubmission.tsx`, one template, not nine — the same discipline
as `formSpec.ts` and `admin/schema.ts`. Everything that differs between forms
arrives as props; the template does not know which form it is rendering beyond
the label it is handed. `submit.ts` builds those props from the same
`formFields()` list it validates against, so the email cannot carry a field the
form does not have.

React Email rather than hand-written HTML, because the primitives compile to
tables with inline styles and that is what survives Outlook's Word renderer.
`renderFormSubmission()` returns **both halves** — the HTML and a plain-text
version written from the same props rather than scraped out of the markup, so
the two cannot drift. Both go to Resend, which sends them as
multipart/alternative.

**It is the site's language, not a copy of its CSS**, and the differences are
deliberate:

- **Cream, never the dark ramp.** A business notification defaults to light in
  every client and under every reader's own dark-mode setting. Forcing dark is
  a real risk of looking broken somewhere nobody can test.
- **No web fonts.** Sora and Fraunces are not requested at all — most clients
  would not load them and would fall back silently. A safe sans stack
  approximates Sora; Georgia stands in for Fraunces, and only on the one
  headline moment where the contrast earns itself.
- **Sage is a rule, a bullet and a left edge — never a fill.** That is the
  palette rule in `docs/brief.md`, and it is also the safe choice: a coloured
  block is what a client's dark mode inverts worst.
- Nothing is styled by a class or a `<style>` block, so a client that strips
  the head still gets the whole design.

The footer says what is true and nothing more: where it came from, that a reply
reaches the sender, and that nothing is stored. It must not drift into stating
policy — that is the Trust Framework's job, per § *The content-honesty rule*.

**What cannot be verified here:** how it actually renders in Outlook, Gmail and
Apple Mail. The constraints above are checked mechanically and the result is
rendered and read in Chromium, but only opening a real received message in each
client settles it.

#### The dropdowns are not `<select>` once JavaScript has run

`FormSelect.tsx`. A `<select>` styles correctly while closed and then renders
its open state in the browser's own chrome — white panel, system font, blue
highlight — which no CSS reaches. The one moment the control is in use is the
one moment it does not belong to the page.

`appearance: base-select` with `::picker(select)` is the right fix and is not
usable yet: Chrome and Edge shipped it in 135, Safari has it in the 27 beta
rather than a public release, Firefox is behind a flag, and it is explicitly
not Baseline. Today it would leave every Firefox and current-Safari visitor
looking at the native panel, which is the bug. **When Safari 27 ships and
Firefox follows, `FormSelect.tsx` collapses into about fifteen lines of CSS** —
that is the intended end state, not a permanent custom widget.

Until then it is the APG select-only combobox, and three things about it are
load-bearing:

- **Progressive enhancement, so nothing a native select gives is lost.** The
  server renders a real `<select>`, and it stays one until the component
  mounts. With JavaScript off, or before hydration, the field *is* the native
  control — operable, and submitting under the same name. Anything chosen in
  that window is carried across on the swap.
- **The value travels in a hidden input** under the field's own name, so
  `formSpec`, the server action's validation and the email body see exactly
  what they saw from a `<select>`. Nothing downstream knows the difference —
  which is also why tampering with it is still caught: the injected-value test
  now rewrites that input and is refused the same way.
- **Focus never leaves the trigger**; `aria-activedescendant` moves through the
  options. Arrow keys, Home/End, Enter, Escape, Tab-commits and letter
  typeahead all behave as the native control does, including that rapid
  letters build one search string rather than jumping per key.

The panel opens upward when there is not room below, measuring the fixed nav
and the fixed draft notice rather than assuming the viewport is free — a
dropdown low on the page would otherwise put its last options under a bar.
Sage is the accent on the highlighted row as a left rule, never a background
fill, per the palette rule in `docs/brief.md`.

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
