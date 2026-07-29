import { BulletLabel, Placeholder, SectionHeader, type Tone } from "@/components/ui";

export type Variant = { name: string; body: string };

const ordinals = ["One", "Two", "Three"];

/**
 * Named-variant comparison row — cards carrying just a name and a short
 * description. No photographs and no prices.
 *
 * Without `variants`, renders three placeholder cards.
 */
export function VariantCards({
  index,
  eyebrow,
  title,
  intro,
  variants,
  tone = "cream",
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
  variants?: Variant[];
  tone?: Tone;
}) {
  const dark = tone !== "cream";
  const rule = dark ? "border-hair-dark" : "border-hair";
  const muted = dark ? "text-white/70" : "text-olive";
  const cards = variants ?? [null, null, null];

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

        <div className="grid grid-cols-1 md:grid-cols-3">
          {cards.map((variant, i) => (
            <div
              key={i}
              className={`flex flex-col gap-5 py-10 md:px-8 first:md:pl-0 ${
                i > 0 ? `md:border-l ${rule}` : ""
              } border-t md:border-t-0 ${rule}`}
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              {variant ? (
                <>
                  <BulletLabel className={muted}>Format</BulletLabel>
                  <h3
                    className={`type-display text-2xl md:text-3xl ${
                      dark ? "text-white" : "text-ink"
                    }`}
                  >
                    {variant.name}
                  </h3>
                  <p className={`type-body ${muted} max-w-sm`}>{variant.body}</p>
                </>
              ) : (
                <>
                  <BulletLabel className={muted}>Format {ordinals[i]}</BulletLabel>
                  <Placeholder tone={tone} lead />
                  <Placeholder tone={tone} />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
