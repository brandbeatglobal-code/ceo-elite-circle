import { ReactNode } from "react";
import { PhotoFrame, SectionHeader } from "@/components/ui";
import type { Photo } from "@/lib/images";

/**
 * Attributed pull-quote: the large quotation, then a small circular portrait
 * beside a short attribution line and supporting paragraph.
 *
 * `quote` and `attribution` take whatever they are given — neither is a string
 * prop with a default, so nothing can be published here by accident.
 */
export function AttributedQuote({
  index,
  eyebrow,
  quote,
  portrait,
  attribution,
  support,
}: {
  index: string;
  eyebrow: string;
  quote: ReactNode;
  portrait: Photo;
  attribution: ReactNode;
  support: ReactNode;
}) {
  return (
    <section className="bg-black text-white">
      <div className="wrap">
        <SectionHeader index={index} eyebrow={eyebrow} tone="black" />

        <div className="pt-16 pb-16 lg:pt-36 lg:pb-40">
          <div className="max-w-5xl lg:[text-indent:18%] mb-16">{quote}</div>

          <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="hidden lg:block lg:col-span-2" />
            <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 flex gap-5 items-start">
              <div className="shrink-0 w-14 h-14 rounded-full overflow-hidden">
                <PhotoFrame
                  photo={portrait}
                  tone="black"
                  greyscale
                  className="h-14"
                  sizes="56px"
                />
              </div>
              <div className="flex flex-col gap-4 items-start">
                {attribution}
                {support}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
