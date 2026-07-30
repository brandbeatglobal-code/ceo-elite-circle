import { PillButton, SectionHeader } from "@/components/ui";
import { forms, type RequestVariant } from "@/lib/forms";

/**
 * The closing form. One component, one variant per context — a governance
 * page and a briefings index should not both end in a membership application.
 *
 * The variants themselves live in `content/forms.json`. Rules that hold across
 * every one of them:
 * - No field implies a capability that does not exist: no upload, no
 *   scheduling, no payment.
 * - Pre-filled context is rendered inert, as a labelled value rather than an
 *   editable field nobody can correct.
 * - Every variant carries its own honest note. Only the two application
 *   variants may describe themselves as an application.
 * - `ctaHref` is set only where the button genuinely lands somewhere that does
 *   what the label promises. Without it the button renders disabled, the same
 *   way the fields do — a working button that navigates somewhere else is the
 *   one part of this section that could mislead, because nothing about it
 *   looks unfinished.
 */
export type { RequestVariant };

export function RequestSection({
  index,
  variant = "membership",
  context,
}: {
  index: string;
  variant?: RequestVariant;
  /** Shown inert above the fields — never an editable input. */
  context?: { label: string; value: string };
}) {
  const c = forms[variant];
  const single = c.columns.length === 1;

  return (
    <section className="bg-ramp-low text-white">
      <div className="wrap">
        <SectionHeader index={index} eyebrow={c.eyebrow} tone="ramp-low" />

        <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair-dark">
          <div className="hidden lg:block lg:col-span-2" />
          <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 py-12 lg:py-28">
            <h2 className="type-h2 mb-10">{c.heading}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <p className="type-lead text-white max-w-xs">{c.lead}</p>
              <p className="type-body text-white/70 max-w-xs">{c.body}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 py-12 lg:py-28">
          <div className="hidden lg:block" />

          <div className={`lg:pr-8 ${single ? "lg:col-span-2" : ""}`}>
            {context && (
              // Inert on purpose: the visitor can see the context the form
              // carries, and cannot mistype it.
              <div className="border border-hair-dark px-4 py-3 mb-8 flex flex-col gap-1">
                <span className="type-label text-white/55">{context.label}</span>
                <span className="type-body text-white">{context.value}</span>
              </div>
            )}
            <p className="type-link text-white mb-7">{c.columns[0].legend}</p>
            <div className="flex flex-col gap-6">
              {c.columns[0].inputs?.map((f) => (
                <input
                  key={f}
                  className="field"
                  placeholder={f}
                  aria-label={f}
                  disabled
                />
              ))}
              {c.columns[0].selects?.map((f) => (
                <select key={f} className="field" aria-label={f} disabled>
                  <option>{f}</option>
                </select>
              ))}
            </div>
          </div>

          {c.columns[1] && (
            <div className="lg:border-l border-hair-dark lg:pl-8 mt-12 lg:mt-0">
              <p className="type-link text-white mb-7">{c.columns[1].legend}</p>
              <div className="flex flex-col gap-6">
                {c.columns[1].inputs?.map((f) => (
                  <input
                    key={f}
                    className="field"
                    placeholder={f}
                    aria-label={f}
                    disabled
                  />
                ))}
                {c.columns[1].selects?.map((f) => (
                  <select key={f} className="field" aria-label={f} disabled>
                    <option>{f}</option>
                  </select>
                ))}
              </div>
            </div>
          )}

          <div className="hidden lg:block" />
        </div>

        <div className="pb-20 flex flex-col items-center gap-8">
          <p className="type-label text-white/55 italic text-center max-w-md">
            {c.note}
          </p>
          {c.ctaHref ? (
            <PillButton
              href={c.ctaHref}
              variant="light"
              className="w-full max-w-2xl"
            >
              {c.cta}
            </PillButton>
          ) : (
            <button
              type="button"
              disabled
              className="pill type-link bg-white text-ink w-full max-w-2xl px-8 py-4 opacity-55 cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              <span aria-hidden="true">•</span>
              {c.cta}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
