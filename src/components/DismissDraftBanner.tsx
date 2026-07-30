"use client";

import { site } from "@/lib/site";

export const DRAFT_BANNER_KEY = "cec-draft-banner-dismissed";

/**
 * The only interactive part of the draft notice. Without JavaScript the button
 * simply does nothing and the notice stays — which is the safe direction.
 */
export function DismissDraftBanner() {
  const dismiss = () => {
    document.documentElement.classList.add("draft-dismissed");
    try {
      window.localStorage.setItem(DRAFT_BANNER_KEY, "1");
    } catch {
      // Storage unavailable; the notice returns on the next visit.
    }
  };

  return (
    <button
      onClick={dismiss}
      className="type-link text-white/70 hover:text-white transition-colors shrink-0"
    >
      {site.draftBanner.dismissLabel}
    </button>
  );
}
