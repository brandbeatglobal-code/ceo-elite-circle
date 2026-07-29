"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const groupOne = [
  { href: "/about", label: "About the Circle" },
  { href: "/pillars", label: "The Five Pillars" },
  { href: "/experiences", label: "Signature Experiences" },
];

const groupTwo = [
  { href: "/membership", label: "Membership" },
  { href: "/trust", label: "Trust Framework" },
  { href: "/councils", label: "Executive Councils" },
];

const allLinks = [...groupOne, ...groupTwo];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Only the homepage opens on a full-bleed photo, so only there does the bar
  // start transparent — and it takes a solid background once you leave the hero.
  const overHero = pathname === "/";

  useEffect(() => {
    if (!overHero) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.82);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  const transparent = overHero && !scrolled && !open;
  const text = transparent ? "text-white" : "text-ink";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        transparent ? "bg-transparent" : "bg-cream/95 backdrop-blur border-b border-hair"
      } ${text}`}
    >
      <div className="wrap flex items-start justify-between py-5 gap-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight shrink-0 leading-none pt-1"
        >
          CEO Elite Circle
        </Link>

        <nav className="hidden lg:flex gap-12 pt-0.5">
          {[groupOne, groupTwo].map((group, i) => (
            <div key={i} className="flex flex-col gap-1">
              {group.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`type-label transition-colors ${
                    transparent
                      ? "text-white/85 hover:text-white"
                      : "text-olive hover:text-sage"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/contact"
            className={`pill type-link hidden lg:inline-flex items-center gap-2 px-6 py-3 transition-colors ${
              transparent
                ? "border border-white/35 text-white hover:bg-white hover:text-ink"
                : "bg-ink text-white hover:bg-sage"
            }`}
          >
            <span aria-hidden="true">•</span>
            Begin Your Membership Journey
          </Link>

          <button
            className={`lg:hidden pill type-link border px-4 py-2 ${
              transparent ? "border-white/40" : "border-hair"
            }`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? "Close" : "Menu"}
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
              href="/contact"
              className="pill type-link bg-ink text-white text-center px-6 py-3.5 mt-5 mb-3"
              onClick={() => setOpen(false)}
            >
              <span aria-hidden="true">•</span> Begin Your Membership Journey
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
