import { ReactNode } from "react";
import { BulletLabel, PhotoFrame } from "@/components/ui";
import { scrimVars, type Photo } from "@/lib/images";

/**
 * Page hero on a photograph: serif headline over the image, with two short
 * body columns held at the bottom. Sits on the dark ramp, so it still reads
 * as intended while a photo slot is unfilled.
 */
export function PhotoHero({
  eyebrow,
  title,
  left,
  right,
  photo,
}: {
  eyebrow: string;
  title: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  photo: Photo;
}) {
  // No photograph, no scrim. The section is the dark ramp underneath, where
  // the copy is already legible — and the labelled pending frame would
  // otherwise be dimmed by a field that exists to guard against an image
  // that is not there.
  const scrim = photo.src !== null;
  return (
    <section
      className="relative min-h-[calc(92svh-var(--banner-h))] flex flex-col justify-end overflow-hidden bg-ramp text-white"
      style={scrim ? scrimVars(photo) : undefined}
    >
      <PhotoFrame
        photo={photo}
        tone="ramp"
        cover
        className="h-full"
        sizes="100vw"
      />
      {scrim && <div className="photo-scrim-nav" />}

      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        <div className="wrap h-full grid grid-cols-4">
          <div />
          <div className="border-l border-white/15" />
          <div className="border-l border-white/15" />
          <div className="border-l border-white/15" />
        </div>
      </div>

      {/* The copy carries its own field — see `.copy-scrim`. The padding here
          is what the gradient fades across; keep the two in step. */}
      <div className={`relative pt-36 lg:pt-44 ${scrim ? "copy-scrim" : ""}`}>
        <div className="wrap hero-foot">
          <BulletLabel className="text-white/75">{eyebrow}</BulletLabel>
          <h1 className="type-display type-hero mt-8 mb-12 max-w-5xl">{title}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-start gap-4">{left}</div>
            <div className="hidden lg:block" />
            <div className="lg:col-span-2 flex flex-col items-start gap-4">
              {right}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
