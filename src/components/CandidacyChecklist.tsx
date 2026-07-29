import { IconArcs, IconOrbit, IconRings, IconStack } from "@/components/Icons";
import {
  BulletLabel,
  Placeholder,
  SectionHeader,
  type Tone,
} from "@/components/ui";

const icons = [IconRings, IconArcs, IconStack, IconOrbit];

/**
 * Candidacy checklist — a 2×2 icon grid answering "who is this for". Same icon
 * language as the About page's difference grid, different use case.
 *
 * Criteria carry structural labels only; the actual answer to "who is this
 * for" is content, and has not been written.
 */
export function CandidacyChecklist({
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
    <section
      className={dark ? "bg-black text-white" : "bg-cream text-ink"}
    >
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

        <div className="pt-10 pb-16">
          <BulletLabel className={dark ? "text-white/60" : "text-olive"}>
            If you are
          </BulletLabel>

          <div className="grid grid-cols-1 md:grid-cols-2 mt-8">
            {icons.map((Icon, i) => (
              <div
                key={i}
                className={`flex flex-col gap-5 py-8 md:px-8 first:md:pl-0 border-t ${rule} ${
                  i % 2 === 1 ? "md:border-l" : ""
                } ${i === 2 ? "md:pl-0" : ""}`}
              >
                <div className="w-14 h-14 lg:w-16 lg:h-16">
                  <Icon className="w-full h-full" />
                </div>
                <BulletLabel className={dark ? "text-white/60" : "text-olive"}>
                  Criterion {["One", "Two", "Three", "Four"][i]}
                </BulletLabel>
                <Placeholder tone={tone} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
