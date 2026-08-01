import { RequestForm } from "@/components/RequestForm";
import { SectionHeader } from "@/components/ui";
import { forms, type RequestVariant } from "@/lib/forms";
import { formColumns } from "@/lib/formSpec";

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
 *
 * The fields are real now: `RequestForm` posts to the `submitForm` server
 * action, which mails the submission. `ctaHref` is gone — it existed to send
 * the two application variants to `/contact` while nothing here could send,
 * and a form that sends does not need somewhere else to point.
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

        <RequestForm
          kind={variant}
          columns={formColumns(variant)}
          cta={c.cta}
          context={context}
        >
          <p className="type-label text-white/55 italic text-center max-w-md">
            {c.note}
          </p>
        </RequestForm>
      </div>
    </section>
  );
}
