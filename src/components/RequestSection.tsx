import { PillButton, SectionHeader } from "@/components/ui";

/**
 * The closing form. One component, one variant per context — a governance
 * page and a briefings index should not both end in a membership application.
 *
 * Rules that hold across every variant:
 * - No field implies a capability that does not exist: no upload, no
 *   scheduling, no payment.
 * - Pre-filled context is rendered inert, as a labelled value rather than an
 *   editable field nobody can correct.
 * - Every variant carries its own honest note. Only the two application
 *   variants may describe themselves as an application.
 */
export type RequestVariant =
  | "membership"
  | "application"
  | "pillar"
  | "experience"
  | "governance"
  | "council"
  | "briefings"
  | "enquiry";

type Column = { legend: string; inputs?: string[]; selects?: string[] };

type Config = {
  eyebrow: string;
  heading: string;
  lead: string;
  body: string;
  columns: Column[];
  note: string;
  cta: string;
};

const CONTACT: Column = {
  legend: "Contact information",
  inputs: ["Name", "Surname", "Phone number", "Email"],
};

const configs: Record<RequestVariant, Config> = {
  membership: {
    eyebrow: "Begin",
    heading: "Request Membership Consideration",
    lead: "Membership in the CEO Elite Circle is by invitation and consideration only.",
    body: "Tell us who you are and what you are working on. Someone from the Circle will read it, and you will hear back either way.",
    columns: [
      CONTACT,
      {
        legend: "Membership details",
        selects: ["Membership category", "Region", "Introduced by", "Preferred contact"],
      },
    ],
    note: "Fields are not yet wired up — the application questions are still being confirmed. The button below opens the full request page.",
    cta: "Request Membership Consideration",
  },

  application: {
    eyebrow: "Apply",
    heading: "Apply for Membership",
    lead: "One application, whichever category you are considered for.",
    body: "Category is decided during consideration rather than chosen at the outset, so an approximate answer is fine here.",
    columns: [
      CONTACT,
      {
        legend: "Membership details",
        selects: ["Membership category", "Organisation", "Region", "Introduced by"],
      },
    ],
    note: "Fields are not yet wired up — the application questions are still being confirmed. The button below opens the full request page.",
    cta: "Request Membership Consideration",
  },

  pillar: {
    eyebrow: "Enquire",
    heading: "Enquire about this pillar",
    lead: "Questions about how a pillar works in practice are welcome before any question of membership.",
    body: "Tell us what you would want from it, and someone who runs it will reply.",
    columns: [
      { legend: "Contact information", inputs: ["Name", "Surname", "Email"] },
      { legend: "Your enquiry", selects: ["Nature of enquiry", "Preferred contact"] },
    ],
    note: "Fields are not yet wired up — enquiry handling is still to be built. This is an enquiry, not a membership application.",
    cta: "Begin Your Membership Journey",
  },

  experience: {
    eyebrow: "Register interest",
    heading: "Register interest in this occasion",
    lead: "Places are held for members, and interest is noted ahead of each occasion.",
    body: "Registering interest carries no obligation and is not an application for membership.",
    columns: [
      { legend: "Contact information", inputs: ["Name", "Surname", "Email"] },
      { legend: "Your interest", selects: ["Attending as", "Region", "Preferred contact"] },
    ],
    note: "Fields are not yet wired up — registration handling is still to be built. Registering interest is not a membership application.",
    cta: "Begin Your Membership Journey",
  },

  governance: {
    eyebrow: "Governance",
    heading: "Ask a governance question",
    lead: "The Trust Framework is being finalised and is not published yet.",
    body: "If you have a question about how the Circle is governed, or would like the framework when it is settled, say so here.",
    columns: [
      { legend: "Contact information", inputs: ["Name", "Email"] },
      { legend: "Your question", selects: ["Area of the framework", "Preferred contact"] },
    ],
    note: "Fields are not yet wired up. This is not a membership application — it reaches the Circle's governance contact.",
    cta: "Send a Governance Question",
  },

  council: {
    eyebrow: "Councils",
    heading: "Express interest in a council",
    lead: "Councils hold their membership across the year, so places open at particular points.",
    body: "Tell us which council fits your work and we will let you know when it next takes members.",
    columns: [
      { legend: "Contact information", inputs: ["Name", "Surname", "Email"] },
      { legend: "Council details", selects: ["Council", "Region", "Preferred contact"] },
    ],
    note: "Fields are not yet wired up — council interest handling is still to be built. This is not a membership application.",
    cta: "Begin Your Membership Journey",
  },

  briefings: {
    eyebrow: "Briefings",
    heading: "Subscribe to briefings",
    lead: "Insights are published sparingly, and only when there is something worth the time.",
    body: "Leave your details and you will receive them as they are written. Nothing else is sent.",
    columns: [{ legend: "Your details", inputs: ["Name", "Email"] }],
    note: "Fields are not yet wired up — subscription handling is still to be built. This is not a membership application.",
    cta: "Subscribe to Briefings",
  },

  enquiry: {
    eyebrow: "Enquire",
    heading: "Enquire about the Circle",
    lead: "Questions are welcome, whether or not they lead anywhere.",
    body: "Tell us what you would like to know and the right person will reply.",
    columns: [
      { legend: "Contact information", inputs: ["Name", "Surname", "Email"] },
      { legend: "Your enquiry", selects: ["Nature of enquiry", "Preferred contact"] },
    ],
    note: "Fields are not yet wired up — enquiry handling is still to be built. This is an enquiry, not a membership application.",
    cta: "Begin Your Membership Journey",
  },
};

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
  const c = configs[variant];
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
          <PillButton href="/contact" variant="light" className="w-full max-w-2xl">
            {c.cta}
          </PillButton>
        </div>
      </div>
    </section>
  );
}
