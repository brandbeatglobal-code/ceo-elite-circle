"use client";

import { useState } from "react";
import { ArrowLink, PhotoFrame } from "@/components/ui";
import type { Photo } from "@/lib/images";

export type ShowcaseItem = {
  slug: string;
  name: string;
  summary: string;
  photo: Photo;
};

/**
 * The homepage's experiences panel: a featured occasion beside its photograph,
 * and the other six as a hairline list that drives it.
 *
 * The interaction has two layers, which is what makes it work on a phone as
 * well as a desktop. **Hover previews** — moving off a row without clicking
 * puts the panel back. **Click pins** — the panel then holds that occasion
 * after the pointer leaves, until another row is hovered or clicked. A tap
 * fires the click, so touch gets the pinning behaviour and never depends on a
 * hover that does not exist there.
 *
 * **Focus does exactly what hover does.** Each row's own "Discover" link is
 * already a tab stop, and `onFocus`/`onBlur` bubble from it to the row, so
 * tabbing through the list drives the panel the same way a pointer does. A
 * hover-only version of this would be invisible to anyone on a keyboard.
 *
 * The links are untouched by any of it. A row's link and the featured link are
 * ordinary navigation to that occasion's own page; hovering and clicking the
 * row only change what is being previewed.
 *
 * **Every link here carries its occasion in its accessible name.** All seven
 * read "Discover" or "Discover the Circle" on screen, which is right beside
 * the name that says where each goes — and completely detached from it in a
 * screen reader's list of links. The featured one needs it because its
 * destination moves with the panel; the six rows need it because they are
 * otherwise indistinguishable from each other.
 *
 * **All seven photographs are rendered, stacked, and cross-faded by opacity.**
 * Swapping one `src` would fetch on demand and flash on first hover. Stacked,
 * they all load together when the section comes near, and the fade is then a
 * property change rather than a network request. `.exp-photo` in `globals.css`
 * carries the transition, so the site-wide `prefers-reduced-motion` block
 * collapses it to an instant swap along with every other transition.
 */
export function ExperienceShowcase({
  items,
  defaultSlug,
  featuredLinkLabel,
  listLinkLabel,
}: {
  /** All seven, in content order. The stack renders every one. */
  items: ShowcaseItem[];
  /** Shown whenever nothing is hovered, focused or pinned. */
  defaultSlug: string;
  featuredLinkLabel: string;
  listLinkLabel: string;
}) {
  const [pinned, setPinned] = useState<string | null>(null);
  const [previewed, setPreviewed] = useState<string | null>(null);

  const activeSlug = previewed ?? pinned ?? defaultSlug;
  const active = items.find((e) => e.slug === activeSlug) ?? items[0];
  const listed = items.filter((e) => e.slug !== defaultSlug);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4">
      <div className="py-14 lg:pr-8 flex flex-col justify-between gap-10">
        <div>
          <h3 className="type-display type-h3 text-white mb-5">
            {active.name}
          </h3>
          <p className="type-body text-white/70">{active.summary}</p>
        </div>
        {/* The visible label is unchanged, so the accessible name still starts
            with it; the occasion is appended because this link's destination
            moves with the panel and "Discover the Circle" alone would not say
            where it now goes. */}
        <ArrowLink
          href={`/experiences/${active.slug}`}
          tone="black"
          ariaLabel={`${featuredLinkLabel}: ${active.name}`}
        >
          {featuredLinkLabel}
        </ArrowLink>
      </div>

      <div className="lg:border-l border-hair-dark lg:pl-8 py-14">
        <div className="relative w-full h-72 lg:h-full lg:min-h-[24rem]">
          {items.map((e) => (
            <PhotoFrame
              key={e.slug}
              photo={e.photo}
              cover
              tone="black"
              sizes="(max-width: 1024px) 100vw, 25vw"
              className={`exp-photo ${e.slug === activeSlug ? "is-active" : ""}`}
            />
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 py-14">
        {listed.map((e) => {
          // One comparison, read twice: `aria-current` is the state, and
          // `.is-active` is only a visual layer over the same answer. They
          // cannot disagree, and the rule is not a second source of truth.
          const isActive = e.slug === activeSlug;
          return (
            <div
              key={e.slug}
              className={`exp-row flex items-baseline justify-between gap-6 border-b border-hair-dark py-5 first:pt-0 cursor-pointer${
                isActive ? " is-active" : ""
              }`}
              onMouseEnter={() => setPreviewed(e.slug)}
              onMouseLeave={() => setPreviewed(null)}
              onFocus={() => setPreviewed(e.slug)}
              onBlur={() => setPreviewed(null)}
              onClick={() => setPinned(e.slug)}
              aria-current={isActive ? true : undefined}
            >
              <h3 className="type-display text-xl md:text-2xl text-white">
                {e.name}
              </h3>
              {/* Six links reading "Discover" and nothing else are six
                  identical entries in a screen reader's link list, each going
                  somewhere different. The occasion is right beside it visually
                  — a sighted visitor reads the row — but nothing joins the two
                  in the accessible name, so it is appended here. The visible
                  label does not change. */}
              <ArrowLink
                href={`/experiences/${e.slug}`}
                tone="black"
                className="shrink-0"
                ariaLabel={`${listLinkLabel}: ${e.name}`}
              >
                {listLinkLabel}
              </ArrowLink>
            </div>
          );
        })}
      </div>
    </div>
  );
}
