import { ReactNode } from "react";
import { BulletLabel, SectionHeader, hair, isDark, type Tone } from "@/components/ui";

export type Feature = {
  icon: ReactNode;
  /** Structural label only — never a claim. */
  label: string;
  body: ReactNode;
};

/**
 * Icon + text feature grid: four hairline-divided cells, each a line-art mark
 * over a label and a short body.
 *
 * `tone` defaults to black, which is what this section was hardcoded to and
 * what every existing call site therefore still gets. It became a prop because
 * a section in a reorderable list is handed its background by where it sits
 * (`SectionList`), and a component that quietly ignores that would make the
 * derivation a lie the first time this landed on an even index.
 */
export function FeatureGrid({
  index,
  eyebrow,
  title,
  intro,
  features,
  link,
  tone = "black",
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  features: Feature[];
  link?: { href: string; label: string };
  tone?: Tone;
}) {
  const dark = isDark(tone);
  const rule = hair(tone);

  return (
    <section className={dark ? "bg-black text-white" : "bg-cream text-ink"}>
      <div className="wrap">
        <SectionHeader
          index={index}
          eyebrow={eyebrow}
          link={link}
          tone={tone}
        />

        <div className={`grid grid-cols-1 lg:grid-cols-4 border-b ${rule}`}>
          <h2 className="type-h2 lg:col-span-2 py-12 lg:py-24 lg:pr-10">
            {title}
          </h2>
          {intro && (
            <div className={`lg:col-span-2 lg:border-l ${rule} lg:pl-8 pb-12 lg:py-24`}>
              {intro}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <article
              key={f.label}
              className={`flex flex-col gap-6 py-10 lg:py-14 sm:px-6 lg:px-5 first:sm:pl-0 first:lg:pl-0 border-t sm:border-t-0 ${rule} ${
                i > 0 ? `sm:border-l ${rule}` : ""
              }`}
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className={`${dark ? "text-white" : "text-ink"} w-16 h-16 lg:w-20 lg:h-20`}>
                {f.icon}
              </div>
              <BulletLabel className={dark ? "text-white/60" : "text-olive"}>
                {f.label}
              </BulletLabel>
              {f.body}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
