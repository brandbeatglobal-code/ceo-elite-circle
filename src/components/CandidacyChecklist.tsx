import { IconArcs, IconOrbit, IconRings, IconStack } from "@/components/Icons";
import {
  BulletLabel,
  Placeholder,
  SectionHeader,
  type Tone,
} from "@/components/ui";

const icons = [IconRings, IconArcs, IconStack, IconOrbit];
const ordinals = ["One", "Two", "Three", "Four"];

export type Criterion = { title: string; body: string };

/**
 * Candidacy checklist — a 2×2 icon grid answering "who is this for". Same icon
 * language as the About page's difference grid, different use case.
 *
 * Without `criteria`, each cell falls back to a structural label and a
 * placeholder.
 */
export function CandidacyChecklist({
  index,
  eyebrow,
  title,
  intro,
  criteria,
  tone = "cream",
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
  criteria?: Criterion[];
  tone?: Tone;
}) {
  const dark = tone !== "cream";
  const rule = dark ? "border-hair-dark" : "border-hair";
  const muted = dark ? "text-white/70" : "text-olive";

  return (
    <section className={dark ? "bg-black text-white" : "bg-cream text-ink"}>
      <div className="wrap">
        <SectionHeader index={index} eyebrow={eyebrow} tone={tone} />

        <div className={`grid grid-cols-1 lg:grid-cols-4 border-b ${rule}`}>
          <h2
            className="type-h2 lg:col-span-2 py-16 lg:py-24 lg:pr-10"
            data-reveal
          >
            {title}
          </h2>
          <div
            className={`lg:col-span-2 lg:border-l ${rule} lg:pl-8 pb-16 lg:py-24`}
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

        <div className="pt-10 pb-16">
          <BulletLabel className={muted}>If you are</BulletLabel>

          <div className="grid grid-cols-1 md:grid-cols-2 mt-8">
            {icons.map((Icon, i) => {
              const item = criteria?.[i];
              return (
                <div
                  key={i}
                  className={`flex flex-col gap-6 py-8 md:px-8 first:md:pl-0 border-t ${rule} ${
                    i % 2 === 1 ? "md:border-l" : ""
                  } ${i === 2 ? "md:pl-0" : ""}`}
                  data-reveal
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <div className="w-14 h-14 lg:w-16 lg:h-16">
                    <Icon className="w-full h-full" />
                  </div>
                  {item ? (
                    <>
                      <h3
                        className={`type-display text-xl md:text-2xl ${
                          dark ? "text-white" : "text-ink"
                        } max-w-xs`}
                      >
                        {item.title}
                      </h3>
                      <p className={`type-body ${muted} max-w-xs`}>{item.body}</p>
                    </>
                  ) : (
                    <>
                      <BulletLabel className={muted}>
                        Criterion {ordinals[i]}
                      </BulletLabel>
                      <Placeholder tone={tone} />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
