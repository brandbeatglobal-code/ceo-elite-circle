import { NumberedSteps } from "@/components/NumberedSteps";
import { RequestForm } from "@/components/RequestForm";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/ui";
import { contact } from "@/lib/contact";
import { formColumns } from "@/lib/formSpec";
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

      {/* The application form — plain underlined fields, no boxes. Real:
          it posts to the `submitForm` server action like every other form. */}
      <section className="bg-ramp-low text-white">
        <div className="wrap">
          <SectionHeader
            index={ordinal(0)}
            eyebrow={form.eyebrow}
            tone="ramp-low"
          />

          <RequestForm
            kind="contact"
            columns={formColumns("contact")}
            cta={form.cta}
            consentLabel={form.consentLabel}
          >
            <p className="type-label text-white/55 italic text-center max-w-md">
              {form.note}
            </p>
          </RequestForm>
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
