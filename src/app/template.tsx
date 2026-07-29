"use client";

import { useEffect } from "react";

/**
 * Page transition.
 *
 * `template.tsx` re-mounts on every navigation, which makes it the natural
 * App Router hook. Chosen over the View Transitions API deliberately: View
 * Transitions needs a capability check plus a fallback path in every browser
 * that lacks it, and its cross-document mode snapshots the outgoing page,
 * which risks delaying navigation. A re-mounting wrapper is entry-only by
 * construction, so it cannot hold up a route change.
 *
 * Three things this deliberately does NOT do:
 *
 * - It does not animate on first load. Sections already fade up on scroll; a
 *   page-level fade on top of that makes above-fold content animate twice.
 *   The module-level flag below is false on the first render and true from the
 *   first navigation onward, so arriving content settles exactly once.
 * - It does not translate, only fades. Movement is the reveal's job.
 * - It does not hide anything without JavaScript. The class it adds is inert
 *   unless `js-anim` is set, which only happens when motion is wanted.
 */
let hasNavigated = false;

export default function Template({ children }: { children: React.ReactNode }) {
  // Read before the effect writes it: false on the very first render of the
  // session, true on every subsequent navigation.
  const animate = hasNavigated;

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return <div className={animate ? "page-enter" : undefined}>{children}</div>;
}
