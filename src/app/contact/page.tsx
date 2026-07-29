import { NumberedSteps } from "@/components/NumberedSteps";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/ui";
import { ordinal } from "@/lib/ordinal";

export const metadata = {
  title: "Request Membership Consideration — CEO Elite Circle",
};

/* SAMPLE COPY. Deliberately free of durations and dates — how long
   consideration takes is a commitment, not a description. */

const selection = [
  {
    title: "Enquiry",
    body: "You write, or a member writes on your behalf. Either route is considered on the same footing.",
  },
  {
    title: "First conversation",
    body: "An unhurried discussion about what you are working on and what you would want from the membership. There is nothing to prepare.",
  },
  {
    title: "Interview",
    body: "A longer conversation with members of the Circle. It runs in both directions — you are assessing the fit as much as we are.",
  },
  {
    title: "Review",
    body: "Your candidacy is considered within the Circle. The question is whether the room is right for you and you for it, rather than whether you are qualified.",
  },
  {
    title: "Acceptance",
    body: "Where consideration is favourable, an invitation follows with the terms of membership. Where it is not, you are told directly.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Begin"
        title="Request Membership Consideration"
        intro="Membership is by invitation and consideration. Share your details below and the Circle will be in touch."
      />

      {/* The application form — plain underlined fields, no boxes */}
      <section className="bg-ramp-low text-white">
        <div className="wrap">
          <SectionHeader
            index={ordinal(0)}
            eyebrow="Application"
            tone="ramp-low"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 py-20 lg:py-28">
            <div className="hidden lg:block" />

            <div className="lg:pr-8" data-reveal>
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

            <div
              className="lg:border-l border-hair-dark lg:pl-8 mt-12 lg:mt-0"
              data-reveal
              style={{ transitionDelay: "90ms" }}
            >
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

      {/* Selection Process, Timeline, Interview, Review and Acceptance were
          five flat sections. They are one sequence, which is what they are. */}
      <NumberedSteps
        index={ordinal(1)}
        eyebrow="Selection process"
        title="How consideration works"
        intro="Five steps, from first enquiry to invitation. How long each takes varies with the enquiry, and is not fixed to a schedule."
        steps={selection}
        tone="cream"
      />
    </>
  );
}
