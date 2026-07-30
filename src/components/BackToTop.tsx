"use client";

import { useEffect, useState } from "react";

/**
 * Floating back-to-top control.
 *
 * Two things it deliberately avoids sitting on top of:
 *
 * - **The draft notice.** It is fixed to the bottom of the viewport, so the
 *   button offsets by `--banner-h` rather than the viewport edge. That variable
 *   drops to `0rem` once the notice is dismissed and disappears with it at
 *   launch, so the button follows without another change.
 * - **The closing CTA.** Most pages end in a full-width pill, and the footer
 *   is full-width too. Rather than guess a safe corner, the button hides once
 *   either has entered the viewport — a floating control over a page's primary
 *   action is worse than no floating control.
 *
 * Rendered but transparent when hidden, so it can fade. `inert` while hidden
 * keeps it out of the tab order and the accessibility tree.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      // Roughly one viewport down.
      const pastFold = window.scrollY > window.innerHeight;

      // Anything full-width at the foot of the page that this must not cover.
      const blockers = [
        document.querySelector("main section:last-of-type"),
        document.querySelector("footer"),
      ];
      const encroaching = blockers.some(
        (el) => el && el.getBoundingClientRect().top < window.innerHeight
      );

      setVisible(pastFold && !encroaching);
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // Deferred rather than called inline, so this is not a synchronous
    // setState inside the effect body.
    const raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      inert={!visible}
      className={`fixed right-6 md:right-11 bottom-[calc(var(--banner-h)+1.5rem)] z-50
        pill type-link inline-flex items-center gap-2 px-5 py-3
        bg-ink text-white border border-white/20
        hover:bg-sage hover:border-sage transition-[opacity,background-color,border-color] duration-300
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <span aria-hidden="true" className="text-sage leading-none">
        ↑
      </span>
      Top
    </button>
  );
}
