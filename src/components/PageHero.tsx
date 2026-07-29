import { BulletLabel } from "@/components/ui";

export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="bg-cream text-ink border-b border-hair">
      <div className="wrap pt-36 md:pt-44 pb-14 md:pb-20">
        <div data-reveal>
          <BulletLabel className="text-olive">{eyebrow}</BulletLabel>
        </div>
        <h1
          className="type-display type-hero mt-8 mb-10 max-w-5xl"
          data-reveal
          style={{ transitionDelay: "90ms" }}
        >
          {title}
        </h1>
        {intro && (
          <div className="grid grid-cols-1 lg:grid-cols-4">
            <div
              className="lg:col-start-3 lg:col-span-2 lg:border-l border-hair lg:pl-10"
              data-reveal
              style={{ transitionDelay: "180ms" }}
            >
              <p className="type-lead max-w-xl">{intro}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
