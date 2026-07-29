import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/ui";
import { ordinal } from "@/lib/ordinal";

const steps = [
  "Selection Process",
  "Timeline",
  "Interview",
  "Review",
  "Acceptance",
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Begin"
        title="Request Membership Consideration"
        intro="The form below is a structural placeholder. Fields, validation, and submission handling will be built once the application questions are confirmed."
      />

      {/* The application form — plain underlined fields, no boxes */}
      <section className="bg-ramp-low text-white">
        <div className="wrap">
          <SectionHeader
            index={ordinal(0)}
            eyebrow="Application"
            tone="ramp-low"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 py-14 lg:py-20">
            <div className="hidden lg:block" />

            <div className="lg:pr-8">
              <p className="type-link text-white mb-7">Contact information</p>
              <div className="flex flex-col gap-6">
                {["Name", "Surname", "Phone number", "Email"].map((f) => (
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

            <div className="lg:border-l border-hair-dark lg:pl-8 mt-12 lg:mt-0">
              <p className="type-link text-white mb-7">Membership details</p>
              <div className="flex flex-col gap-6">
                {[
                  "Membership category",
                  "Region",
                  "Introduced by",
                  "Preferred contact",
                ].map((f) => (
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
              I have read and agree to the Privacy policy
            </label>
            <button
              type="button"
              disabled
              className="pill type-link bg-white text-ink w-full max-w-2xl px-8 py-4 opacity-55 cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              <span aria-hidden="true">•</span>
              Request Membership Consideration
            </button>
            <p className="type-label text-white/55 italic text-center max-w-md">
              Form disabled in this scaffold — it will be wired up once the
              fields and submission handling are confirmed.
            </p>
          </div>
        </div>
      </section>

      {steps.map((title, i) => (
        <Section key={title} index={ordinal(i + 1)} title={title} />
      ))}
    </>
  );
}
