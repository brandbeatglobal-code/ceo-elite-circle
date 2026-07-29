import { ReactNode } from "react";
import { BulletLabel, PhotoFrame, PillButton } from "@/components/ui";
import type { Photo } from "@/lib/images";

/**
 * Split-screen profile hero: photograph on one side, name and intro on the
 * other, rather than a full-bleed image behind the text.
 */
export function SplitHero({
  eyebrow,
  credentials,
  title,
  role,
  intro,
  photo,
}: {
  eyebrow: string;
  credentials: ReactNode;
  title: ReactNode;
  role: ReactNode;
  intro: ReactNode;
  photo: Photo;
}) {
  return (
    <section className="bg-ramp text-white">
      <div className="wrap pt-28 lg:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-0 pb-10">
          <div className="lg:col-span-2 lg:pr-10 flex flex-col justify-center gap-6 order-2 lg:order-1">
            <BulletLabel className="text-white/75">{eyebrow}</BulletLabel>
            {credentials}
            {role}
            <div className="type-display type-h2 mt-2">{title}</div>
          </div>

          <div className="lg:border-l border-hair-dark order-1 lg:order-2">
            <PhotoFrame
              photo={photo}
              tone="ramp"
              greyscale
              className="h-80 lg:h-[32rem]"
              sizes="(max-width: 1024px) 100vw, 25vw"
            />
          </div>

          <div className="lg:border-l border-hair-dark lg:pl-8 flex flex-col justify-end gap-5 order-3 pb-2">
            {intro}
          </div>
        </div>

        <PillButton href="/contact" variant="outline" className="w-full mb-10">
          Request Membership Consideration
        </PillButton>
      </div>
    </section>
  );
}
