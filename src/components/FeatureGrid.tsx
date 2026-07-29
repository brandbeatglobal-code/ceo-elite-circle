import { ReactNode } from "react";
import { BulletLabel, SectionHeader } from "@/components/ui";

export type Feature = {
  icon: ReactNode;
  /** Structural label only — never a claim. */
  label: string;
  body: ReactNode;
};

/**
 * Icon + text feature grid on black: four hairline-divided cells, each a
 * line-art mark over a label and a short body.
 */
export function FeatureGrid({
  index,
  eyebrow,
  title,
  intro,
  features,
  link,
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  features: Feature[];
  link?: { href: string; label: string };
}) {
  return (
    <section className="bg-black text-white">
      <div className="wrap">
        <SectionHeader
          index={index}
          eyebrow={eyebrow}
          link={link}
          tone="black"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair-dark">
          <h2 className="type-h2 lg:col-span-2 py-12 lg:py-16 lg:pr-10">
            {title}
          </h2>
          {intro && (
            <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 pb-12 lg:py-16">
              {intro}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <article
              key={f.label}
              className={`flex flex-col gap-6 py-10 sm:px-6 lg:px-5 first:sm:pl-0 first:lg:pl-0 border-t sm:border-t-0 border-hair-dark ${
                i > 0 ? "sm:border-l border-hair-dark" : ""
              }`}
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className="text-white w-16 h-16 lg:w-20 lg:h-20">
                {f.icon}
              </div>
              <BulletLabel className="text-white/60">{f.label}</BulletLabel>
              {f.body}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
