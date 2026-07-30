import { DismissDraftBanner } from "@/components/DismissDraftBanner";
import { site } from "@/lib/site";

/**
 * Work-in-progress notice, shown while the site carries sample copy.
 *
 * Server-rendered, so it is present for a visitor without JavaScript — who is
 * exactly the visitor with no other signal that the copy is provisional. Only
 * the dismiss button is a client component.
 *
 * Dismissal is a class on the document element (`draft-dismissed`), set by the
 * button and re-applied before paint by the inline script in `layout.tsx`. The
 * CSS in globals.css hides the bar and drops the body padding.
 *
 * Remove this component, `DismissDraftBanner`, its mount in the layout, and
 * the `.draft-banner` rules at launch. That is the whole removal.
 */
export function DraftBanner() {
  return (
    <div
      role="status"
      className="draft-banner fixed bottom-0 left-0 right-0 z-[60] bg-ink text-white/90 border-t border-white/15"
    >
      <div className="wrap flex items-center justify-between gap-6 py-2.5">
        <p className="type-label">
          <span className="text-sage" aria-hidden="true">
            •
          </span>{" "}
          {site.draftBanner.text}
        </p>
        <DismissDraftBanner />
      </div>
    </div>
  );
}
