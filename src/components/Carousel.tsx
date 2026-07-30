"use client";

import { ReactNode, useRef } from "react";

/** Horizontal rail with working ← → controls, per the reference's news row. */
export function Carousel({ children }: { children: ReactNode }) {
  const rail = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    el.scrollBy({
      left: dir * el.clientWidth * 0.6,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <div>
      <div className="flex justify-end gap-5 py-5">
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Previous"
          className="text-white/60 hover:text-sage transition-colors text-lg leading-none"
        >
          ←
        </button>
        <button
          onClick={() => scrollBy(1)}
          aria-label="Next"
          className="text-white/60 hover:text-sage transition-colors text-lg leading-none"
        >
          →
        </button>
      </div>
      {/* Focusable so the rail can be scrolled from the keyboard; axe flags a
          scrollable region that cannot be reached without a pointer. */}
      <div
        ref={rail}
        tabIndex={0}
        role="group"
        aria-label="Scrollable cards"
        className="no-scrollbar flex gap-8 overflow-x-auto snap-x snap-mandatory pb-16 focus-visible:outline focus-visible:outline-1 focus-visible:outline-sage"
      >
        {children}
      </div>
    </div>
  );
}
