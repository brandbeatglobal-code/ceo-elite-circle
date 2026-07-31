import { ReactNode } from "react";
import { BulletLabel, PhotoFrame } from "@/components/ui";
import { photoText, scrimVars, type Photo } from "@/lib/images";

/**
 * Page hero on a photograph: serif headline over the image, with two short
 * body columns held at the bottom. Sits on the dark ramp, so it still reads
 * as intended while a photo slot is unfilled.
 *
 * The copy colour is the slot's own `textMode`, read through `photoText` —
 * headline, body, CTA and the transparent nav above it all take it from the
 * one place, which is what stops them disagreeing. `Nav` reads the same field
 * for the two routes that open on one of these.
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
  const t = photoText(photo);
  return (
    <section
      className={`relative min-h-[calc(92svh-var(--banner-h))] flex flex-col justify-end overflow-hidden ${t.surface}`}
      style={scrim ? scrimVars(photo) : undefined}
    >
      <PhotoFrame
        photo={photo}
        tone={t.tone}
        cover
        className="h-full"
        sizes="100vw"
      />
      {scrim && <div className="photo-scrim-nav" />}

      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        <div className="wrap h-full grid grid-cols-4">
          <div />
          <div className={`border-l ${t.rule}`} />
          <div className={`border-l ${t.rule}`} />
          <div className={`border-l ${t.rule}`} />
        </div>
      </div>

      {/* The copy carries its own field — see `.copy-scrim`. The padding here
          is what the gradient fades across; keep the two in step. */}
      <div className={`relative pt-36 lg:pt-44 ${scrim ? "copy-scrim" : ""}`}>
        <div className="wrap hero-foot">
          <BulletLabel className={t.label}>{eyebrow}</BulletLabel>
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
