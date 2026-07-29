import { ReactNode } from "react";
import { SectionHeader } from "@/components/ui";
import { PhotoFrame } from "@/components/ui";
import type { Photo } from "@/lib/images";

/**
 * Pull-quote over a photograph: a large headline across the upper half, with
 * the quote and a short supporting paragraph held low against the image.
 *
 * The quote slot takes whatever it is given — it is deliberately not a string
 * prop with a default, so nothing can be published here by accident.
 */
export function QuoteSection({
  index,
  eyebrow,
  title,
  photo,
  quote,
  support,
}: {
  index: string;
  eyebrow: string;
  title: string;
  photo: Photo;
  quote: ReactNode;
  support: ReactNode;
}) {
  return (
    <section className="relative bg-ramp text-white overflow-hidden">
      <PhotoFrame
        photo={photo}
        tone="ramp"
        cover
        className="h-full"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/62" />

      <div className="wrap relative">
        <SectionHeader index={index} eyebrow={eyebrow} tone="ramp" />

        <div className="pt-16 pb-16 lg:pt-24 lg:pb-28">
          <h2 className="type-h2 max-w-5xl lg:[text-indent:22%] mb-16 lg:mb-28">
            {title}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-start gap-4">{quote}</div>
            <div className="flex flex-col items-start gap-4 lg:border-l border-hair-dark lg:pl-8">
              {support}
            </div>
            <div className="hidden lg:block lg:col-span-2" />
          </div>
        </div>
      </div>
    </section>
  );
}
