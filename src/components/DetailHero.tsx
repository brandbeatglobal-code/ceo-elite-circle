import { BulletLabel, PhotoFrame, PillButton, Placeholder } from "@/components/ui";
import type { Photo } from "@/lib/images";

/**
 * Detail-page hero: serif title held high over a full-bleed photograph, a
 * short intro to the right, and the full-width pill running along the bottom.
 * Used consistently across every pillar and experience detail page.
 */
export function DetailHero({
  eyebrow,
  title,
  summary,
  photo,
}: {
  eyebrow: string;
  title: string;
  summary?: string;
  photo: Photo;
}) {
  return (
    <section className="relative min-h-[calc(88svh-var(--banner-h))] flex flex-col overflow-hidden bg-ramp text-white">
      <PhotoFrame photo={photo} tone="ramp" cover className="h-full" sizes="100vw" />
      <div className="absolute inset-0 bg-black/55" />

      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        <div className="wrap h-full grid grid-cols-4">
          <div />
          <div className="border-l border-white/15" />
          <div className="border-l border-white/15" />
          <div className="border-l border-white/15" />
        </div>
      </div>

      <div className="wrap relative flex-1 flex flex-col justify-between pt-36 lg:pt-44 hero-foot">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3">
            <div data-reveal>
              <BulletLabel className="text-white/75">{eyebrow}</BulletLabel>
            </div>
            <h1
              className="type-display type-hero mt-6 max-w-4xl"
              data-reveal
              style={{ transitionDelay: "90ms" }}
            >
              {title}
            </h1>
          </div>
          <div
            className="flex items-end"
            data-reveal
            style={{ transitionDelay: "200ms" }}
          >
            {summary ? (
              <p className="type-body text-white/80 max-w-xs">{summary}</p>
            ) : (
              <Placeholder tone="ramp" />
            )}
          </div>
        </div>

        <div data-reveal style={{ transitionDelay: "280ms" }}>
          <PillButton href="/contact" variant="outline" className="w-full mt-12">
            Request Membership Consideration
          </PillButton>
        </div>
      </div>
    </section>
  );
}
