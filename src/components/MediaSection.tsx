import { ReactNode } from "react";
import {
  ArrowLink,
  PhotoFrame,
  SectionHeader,
  type Tone,
} from "@/components/ui";
import type { Photo } from "@/lib/images";

/**
 * Split section: headline and copy held in the left columns, one large photo
 * running full-bleed down the right half to the section's bottom edge.
 */
export function MediaSection({
  index,
  eyebrow,
  title,
  photo,
  tone = "cream",
  link,
  children,
}: {
  index: string;
  eyebrow: string;
  title: string;
  photo: Photo;
  tone?: Tone;
  link?: { href: string; label: string };
  children?: ReactNode;
}) {
  const dark = tone !== "cream";
  const rule = dark ? "border-hair-dark" : "border-hair";

  return (
    <section className={`${dark ? "bg-black text-white" : "bg-cream text-ink"}`}>
      <div className="wrap">
        <SectionHeader index={index} eyebrow={eyebrow} tone={tone} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="wrap lg:pr-14 py-14 lg:py-24 flex flex-col justify-end">
          <h2 className="type-h2 mb-10 max-w-xl">{title}</h2>
          <div className="flex flex-col items-start gap-6 max-w-md">
            {children}
            {link && (
              <ArrowLink href={link.href} tone={tone}>
                {link.label}
              </ArrowLink>
            )}
          </div>
        </div>

        <div className={`lg:border-l ${rule}`}>
          <PhotoFrame
            photo={photo}
            tone={tone}
            className="h-72 sm:h-96 lg:h-full lg:min-h-[38rem]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
