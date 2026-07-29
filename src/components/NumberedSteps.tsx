import { Placeholder, SectionHeader, type Tone } from "@/components/ui";

/**
 * Numbered preparation steps — a hairline-divided vertical list: numeral,
 * title, description. Sequence only, no dates; the About page's milestone list
 * is the dated one.
 */
export function NumberedSteps({
  index,
  eyebrow,
  title,
  count = 4,
  tone = "black",
}: {
  index: string;
  eyebrow: string;
  title: string;
  count?: number;
  tone?: Tone;
}) {
  const dark = tone !== "cream";
  const rule = dark ? "border-hair-dark" : "border-hair";

  return (
    <section className={dark ? "bg-black text-white" : "bg-cream text-ink"}>
      <div className="wrap">
        <SectionHeader index={index} eyebrow={eyebrow} tone={tone} />

        <div className={`grid grid-cols-1 lg:grid-cols-4 border-b ${rule}`}>
          <h2 className="type-h2 lg:col-span-2 py-12 lg:py-16 lg:pr-10">
            {title}
          </h2>
          <div className={`lg:col-span-2 lg:border-l ${rule} lg:pl-8 pb-12 lg:py-16`}>
            <Placeholder tone={tone} lead />
          </div>
        </div>

        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className={`grid grid-cols-1 lg:grid-cols-4 border-b ${rule} py-8 gap-6`}
          >
            <div className={`type-label ${dark ? "text-white/55" : "text-olive"}`}>
              {i + 1}
            </div>
            <div className={`lg:border-l ${rule} lg:pl-8`}>
              <Placeholder tone={tone} lead />
            </div>
            <div className={`lg:col-span-2 lg:border-l ${rule} lg:pl-8`}>
              <Placeholder tone={tone} />
            </div>
          </div>
        ))}

        <div className="pb-8" />
      </div>
    </section>
  );
}
