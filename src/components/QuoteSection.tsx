import { ReactNode } from "react";
import { SectionHeader } from "@/components/ui";
import { PhotoFrame } from "@/components/ui";
import { photoText, scrimVars, type Photo } from "@/lib/images";

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
  // No photograph, no scrim — see `PhotoHero` for the reasoning.
  const scrim = photo.src !== null;
  const t = photoText(photo);
  return (
    <section
      className={`relative overflow-hidden ${t.surface}`}
      style={scrim ? scrimVars(photo) : undefined}
    >
      <PhotoFrame
        photo={photo}
        tone={t.tone}
        cover
        className="h-full"
        sizes="100vw"
      />
      {scrim && <div className="photo-scrim" />}

      {/* This section is copy from top to bottom, so its field covers the
          whole of it — there is no empty band to leave light. */}
      <div className={`relative ${scrim ? "copy-scrim-band" : ""}`}>
        <div className="wrap">
          <SectionHeader index={index} eyebrow={eyebrow} tone={t.tone} />

          <div className="pt-16 pb-16 lg:pt-36 lg:pb-40">
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
      </div>
    </section>
  );
}
