"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll-reveal driver.
 *
 * Server components opt in by emitting `data-reveal` (and an optional inline
 * `transitionDelay` for stagger) — no component needs to become a client
 * component to animate. This watches for those elements and marks each one
 * visible once, the first time it enters the viewport.
 *
 * It does nothing at all unless `js-anim` is on the document element, which
 * the head script only adds when motion is wanted. Elements are never hidden
 * by this component; the CSS does the hiding, and only under `js-anim`.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (!document.documentElement.classList.contains("js-anim")) return;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)")
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.04 }
    );

    // Anything already scrolled past when this attaches will never intersect
    // again — the observer only fires on entry. That happens on browser scroll
    // restoration, on a deep link with a hash, or if the visitor scrolls during
    // load. Those elements are shown outright rather than left invisible.
    for (const el of targets) {
      if (el.getBoundingClientRect().bottom < 0) {
        el.classList.add("is-visible");
      } else {
        observer.observe(el);
      }
    }

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
