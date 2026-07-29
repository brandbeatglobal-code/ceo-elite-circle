import { PillButton, SectionHeader } from "@/components/ui";

/**
 * The closing "Request Membership Consideration" section.
 *
 * Sits last on every page except `/contact`, whose own form is the real,
 * wired-up version of this rather than a teaser. `index` is the next number in
 * the host page's own running index, so each page numbers it independently.
 */
export function RequestSection({ index }: { index: string }) {
  return (
    <section className="bg-ramp-low text-white">
      <div className="wrap">
        <SectionHeader index={index} eyebrow="Begin" tone="ramp-low" />

        <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair-dark">
          <div className="hidden lg:block lg:col-span-2" />
          <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 py-20 lg:py-28">
            <h2 className="type-h2 mb-10">Request Membership Consideration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <p className="type-lead text-white max-w-xs">
                Membership in the CEO Elite Circle is by invitation and
                consideration only.
              </p>
              <p className="type-body text-white/70 max-w-xs">
                Tell us who you are and what you are working on. Someone from
                the Circle will read it, and you will hear back either way.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 py-20 lg:py-28">
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
          <p className="type-label text-white/55 italic text-center max-w-md">
            Fields are not yet wired up — the application questions are still
            being confirmed. The button below opens the full request page.
          </p>
          <PillButton href="/contact" variant="light" className="w-full max-w-2xl">
            Request Membership Consideration
          </PillButton>
        </div>
      </div>
    </section>
  );
}
