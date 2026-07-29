import { Placeholder, SectionHeader, type Tone } from "@/components/ui";

export type Step = { title: string; body: string };

/**
 * Numbered steps — a hairline-divided vertical list: numeral, title,
 * description. Sequence only, no dates; the About page's milestone list is the
 * dated one.
 *
 * Without `steps`, renders `count` placeholder rows.
 */
export function NumberedSteps({
  index,
  eyebrow,
  title,
  intro,
  steps,
  count = 4,
  tone = "black",
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
  steps?: Step[];
  count?: number;
  tone?: Tone;
}) {
  const dark = tone !== "cream";
  const rule = dark ? "border-hair-dark" : "border-hair";
  const muted = dark ? "text-white/70" : "text-olive";
  const rows = steps ?? Array.from({ length: count }, () => null);

  return (
    <section className={dark ? "bg-black text-white" : "bg-cream text-ink"}>
      <div className="wrap">
        <SectionHeader index={index} eyebrow={eyebrow} tone={tone} />

        <div className={`grid grid-cols-1 lg:grid-cols-4 border-b ${rule}`}>
          <h2
            className="type-h2 lg:col-span-2 py-12 lg:py-16 lg:pr-10"
            data-reveal
          >
            {title}
          </h2>
          <div
            className={`lg:col-span-2 lg:border-l ${rule} lg:pl-8 pb-12 lg:py-16`}
            data-reveal
            style={{ transitionDelay: "80ms" }}
          >
            {intro ? (
              <p className={`type-lead ${dark ? "text-white" : "text-ink"} max-w-lg`}>
                {intro}
              </p>
            ) : (
              <Placeholder tone={tone} lead />
            )}
          </div>
        </div>

        {rows.map((step, i) => (
          <div
            key={i}
            className={`grid grid-cols-1 lg:grid-cols-4 border-b ${rule} py-8 gap-6`}
            data-reveal
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className={`type-label ${muted}`}>{i + 1}</div>
            <div className={`lg:border-l ${rule} lg:pl-8`}>
              {step ? (
                <h3
                  className={`type-display text-xl md:text-2xl ${
                    dark ? "text-white" : "text-ink"
                  }`}
                >
                  {step.title}
                </h3>
              ) : (
                <Placeholder tone={tone} lead />
              )}
            </div>
            <div className={`lg:col-span-2 lg:border-l ${rule} lg:pl-8`}>
              {step ? (
                <p className={`type-body ${muted} max-w-xl`}>{step.body}</p>
              ) : (
                <Placeholder tone={tone} />
              )}
            </div>
          </div>
        ))}

        <div className="pb-8" />
      </div>
    </section>
  );
}
