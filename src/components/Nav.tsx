"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/about", label: "About the Circle" },
  { href: "/pillars", label: "The Five Pillars" },
  { href: "/experiences", label: "Signature Experiences" },
  { href: "/membership", label: "Membership" },
  { href: "/trust", label: "Trust Framework" },
  { href: "/councils", label: "Executive Councils" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone">
      <div className="wrap flex items-center justify-between h-20">
        <Link
          href="/"
          className="font-display text-2xl tracking-wide text-forest"
        >
          CEO Elite Circle
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ink-soft hover:text-forest transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="hidden lg:inline-block border border-forest text-forest text-sm px-5 py-2 hover:bg-forest hover:text-white transition-colors"
        >
          Begin Your Membership Journey
        </Link>

        <button
          className="lg:hidden text-forest text-sm border border-forest px-3 py-1.5"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden wrap pb-6 flex flex-col gap-4 bg-white border-t border-stone">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-ink-soft hover:text-forest pt-4"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-2 border border-forest text-forest text-center px-5 py-2"
            onClick={() => setOpen(false)}
          >
            Begin Your Membership Journey
          </Link>
        </nav>
      )}
    </header>
  );
}
