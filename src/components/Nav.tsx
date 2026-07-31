"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import type { TextMode } from "@/lib/images";

/** Grouped by meaning rather than split to balance the count. */
const { groups, cta } = site.nav;

const allLinks = groups.flatMap((g) => g.links);

/**
 * `heroTextModes` maps each route that opens on a full-bleed photograph to
 * that photograph's copy colour — built in `SiteChrome`, which is a server
 * component and can read the content files without shipping them here.
 *
 * While the bar is transparent it is sitting on the hero's picture, so it has
 * to wear the hero's mode rather than a hardcoded white: a dark-mode hero on a
 * pale photograph would otherwise leave white nav links floating on it. Once
 * the bar goes solid it is on cream and is ink either way.
 */
export default function Nav({
  heroTextModes,
}: {
  heroTextModes: Record<string, TextMode>;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Routes that open on a full-bleed photo hero: the bar starts transparent
  // there, and takes a solid background once you scroll past the hero.
  const overHero = pathname in heroTextModes;

  useEffect(() => {
    if (!overHero) return;
    // A fixed distance, not a fraction of the viewport. The bar has to go
    // solid before any hero copy can travel up behind it, and a percentage of
    // viewport height cannot promise that: a tall headline, a short viewport
    // or hero content that overflows all put white text under a transparent
    // white bar long before the old 82% threshold was reached.
    //
    // 32px is not arbitrary. The gap between the bar and the first line of
    // hero copy is 176px on a tall desktop window but bottoms out at 52px
    // once the hero content overflows — from about 800px of viewport height
    // down, it stops shrinking because the copy cannot rise past its own top
    // padding. So the trigger has to sit under 52px whatever the screen, and
    // this leaves 20px of margin. See `navtest2.mjs`, which measures both
    // numbers rather than assuming either.
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  const transparent = overHero && !scrolled && !open;
  // Transparent over a dark-copy hero. Every colour below reads this one
  // value, so the bar cannot end up half in one mode and half in the other.
  const onDarkCopy = transparent && heroTextModes[pathname] === "dark";
  const text = !transparent || onDarkCopy ? "text-ink" : "text-white";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ease-out ${
        transparent ? "bg-transparent" : "bg-cream/95 backdrop-blur border-b border-hair"
      } ${text}`}
    >
      <div className="wrap flex items-start justify-between py-5 gap-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight shrink-0 leading-none pt-1"
        >
          {site.brand}
        </Link>

        {/* Three equal columns, so the single-item group does not read as
            orphaned next to two full ones. */}
        <nav className="hidden lg:flex gap-8 pt-0.5">
          {groups.map((group) => (
            <div key={group.heading} className="flex flex-col gap-2 w-44">
              <span
                className={`type-link ${
                  !transparent ? "text-olive" : onDarkCopy ? "text-ink/75" : "text-white/75"
                }`}
              >
                {group.heading}
              </span>
              <div className="flex flex-col gap-1">
                {group.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`type-label transition-colors ${
                      !transparent
                        ? "text-olive hover:text-sage"
                        : onDarkCopy
                          ? "text-ink/85 hover:text-ink"
                          : "text-white/85 hover:text-white"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <Link
            href={cta.href}
            className={`pill type-link hidden lg:inline-flex items-center gap-2 px-6 py-3 transition-colors ${
              !transparent
                ? "bg-ink text-white hover:bg-sage"
                : onDarkCopy
                  ? "border border-ink/35 text-ink hover:bg-ink hover:text-white"
                  : "border border-white/35 text-white hover:bg-white hover:text-ink"
            }`}
          >
            <span aria-hidden="true">•</span>
            {cta.label}
          </Link>

          <button
            className={`lg:hidden pill type-link border px-4 py-2 ${
              !transparent ? "border-hair" : onDarkCopy ? "border-ink/40" : "border-white/40"
            }`}
            onClick={() => setOpen(!open)}
            aria-label={site.nav.menuAriaLabel}
            aria-expanded={open}
          >
            {open ? site.nav.closeLabel : site.nav.menuLabel}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden bg-cream text-ink border-t border-hair">
          <div className="wrap flex flex-col py-2">
            {allLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="type-label text-olive hover:text-sage py-3 border-b border-hair"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={cta.href}
              className="pill type-link bg-ink text-white text-center px-6 py-3.5 mt-5 mb-3"
              onClick={() => setOpen(false)}
            >
              <span aria-hidden="true">•</span> {cta.label}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
