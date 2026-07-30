import { NumberedSteps } from "@/components/NumberedSteps";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/ui";
import { contact } from "@/lib/contact";
import { ordinal } from "@/lib/ordinal";

export const metadata = { title: contact.metaTitle };

/* SAMPLE COPY in `content/contact.json`. Deliberately free of durations and
   dates — how long consideration takes is a commitment, not a description. */

const { hero, form, selection } = contact;

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        intro={hero.intro}
      />

      {/* The application form — plain underlined fields, no boxes */}
      <section className="bg-ramp-low text-white">
        <div className="wrap">
          <SectionHeader
            index={ordinal(0)}
            eyebrow={form.eyebrow}
            tone="ramp-low"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 py-12 lg:py-28">
            <div className="hidden lg:block" />

            <div className="lg:pr-8" data-reveal>
              <p className="type-link text-white mb-7">{form.contactLegend}</p>
              <div className="flex flex-col gap-6">
                {form.contactFields.map((f) => (
                  <input
                    key={f}
                    className="field"
                    placeholder={f}
                    aria-label={f}
                    disabled
                  />
                ))}
              </div>
            </div>

            <div
              className="lg:border-l border-hair-dark lg:pl-8 mt-12 lg:mt-0"
              data-reveal
              style={{ transitionDelay: "90ms" }}
            >
              <p className="type-link text-white mb-7">{form.detailsLegend}</p>
              <div className="flex flex-col gap-6">
                {form.detailsFields.map((f) => (
                  <select key={f} className="field" aria-label={f} disabled>
                    <option>{f}</option>
                  </select>
                ))}
              </div>
            </div>

            <div className="hidden lg:block" />
          </div>

          <div className="pb-20 flex flex-col items-center gap-8">
            <label className="type-label text-white/70 flex items-center gap-3">
              <input type="checkbox" disabled className="accent-sage" />
              {form.consentLabel}
            </label>
            <button
              type="button"
              disabled
              className="pill type-link bg-white text-ink w-full max-w-2xl px-8 py-4 opacity-55 cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              <span aria-hidden="true">•</span>
              {form.cta}
            </button>
            <p className="type-label text-white/55 italic text-center max-w-md">
              {form.note}
            </p>
          </div>
        </div>
      </section>

      {/* Selection Process, Timeline, Interview, Review and Acceptance were
          five flat sections. They are one sequence, which is what they are. */}
      <NumberedSteps
        index={ordinal(1)}
        eyebrow={selection.eyebrow}
        title={selection.title}
        intro={selection.intro}
        steps={selection.steps}
        tone="cream"
      />
    </>
  );
}
