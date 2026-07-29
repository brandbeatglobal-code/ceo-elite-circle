import { BulletLabel, Placeholder, SectionHeader, type Tone } from "@/components/ui";

const labels = ["One", "Two", "Three"];

/**
 * Named-variant comparison row — three cards, each just a name and a short
 * description. No photographs and no prices; simpler than the homepage's
 * pillar cards.
 */
export function VariantCards({
  index,
  eyebrow,
  title,
  tone = "cream",
}: {
  index: string;
  eyebrow: string;
  title: string;
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

        <div className="grid grid-cols-1 md:grid-cols-3">
          {labels.map((label, i) => (
            <div
              key={label}
              className={`flex flex-col gap-5 py-10 md:px-8 first:md:pl-0 ${
                i > 0 ? `md:border-l ${rule}` : ""
              } border-t md:border-t-0 ${rule}`}
            >
              <BulletLabel className={dark ? "text-white/60" : "text-olive"}>
                Format {label}
              </BulletLabel>
              <Placeholder tone={tone} lead />
              <Placeholder tone={tone} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
