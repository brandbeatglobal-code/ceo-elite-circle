"use client";

import { useEffect, useSyncExternalStore } from "react";

const KEY = "cec-draft-banner-dismissed";

/* The dismissal lives in localStorage, which is an external store rather than
   React state — reading it with useSyncExternalStore keeps the server render
   and the hydrated render consistent without a setState-in-effect cascade. */
let listeners: Array<() => void> = [];

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(KEY) === "1" ? "dismissed" : "visible";
  } catch {
    // Storage unavailable (private mode, blocked). Show the notice.
    return "visible";
  }
}

/** Rendered as dismissed on the server: the banner appears after hydration. */
function getServerSnapshot() {
  return "dismissed" as const;
}

/**
 * Work-in-progress notice, shown while the site carries sample copy.
 *
 * Remove this component and its mount in the layout at launch — that is the
 * whole removal. It is deliberately not wired to anything else.
 */
export function DraftBanner() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const show = state === "visible";

  useEffect(() => {
    document.body.classList.toggle("has-draft-banner", show);
    return () => document.body.classList.remove("has-draft-banner");
  }, [show]);

  if (!show) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      // Nothing to persist to; the notice returns on the next visit.
    }
    listeners.forEach((l) => l());
  };

  return (
    <div
      role="status"
      className="fixed bottom-0 left-0 right-0 z-[60] bg-ink text-white/90 border-t border-white/15"
    >
      <div className="wrap flex items-center justify-between gap-6 py-2.5">
        <p className="type-label">
          <span className="text-sage" aria-hidden="true">
            •
          </span>{" "}
          Work-in-progress preview — copy and imagery on this site are
          placeholders and not final.
        </p>
        <button
          onClick={dismiss}
          className="type-link text-white/70 hover:text-white transition-colors shrink-0"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
