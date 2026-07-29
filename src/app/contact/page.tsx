import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Begin"
        title="Request Membership Consideration"
        intro="The form below is a structural placeholder. Fields, validation, and submission handling will be built once the application questions are confirmed."
      />

      <section className="bg-white">
        <div className="wrap py-16 max-w-xl">
          <form className="space-y-6">
            <div>
              <label className="block text-sm text-ink-soft mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full border border-stone px-4 py-3 bg-stone/30"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm text-ink-soft mb-2">
                Company / Title
              </label>
              <input
                type="text"
                className="w-full border border-stone px-4 py-3 bg-stone/30"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm text-ink-soft mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-stone px-4 py-3 bg-stone/30"
                disabled
              />
            </div>
            <button
              type="button"
              className="bg-forest text-white text-sm px-8 py-4 opacity-60 cursor-not-allowed"
              disabled
            >
              Request Membership Consideration
            </button>
            <p className="text-xs text-ink-soft/70 italic">
              Form disabled in this scaffold — will be wired up once fields
              and submission handling are confirmed.
            </p>
          </form>
        </div>
      </section>

      <Section title="Selection Process" tone="stone" />
      <Section title="Timeline" />
      <Section title="Interview" tone="stone" />
      <Section title="Review" />
      <Section title="Acceptance" tone="stone" />
    </>
  );
}
