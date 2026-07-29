import { ReactNode } from "react";
import { PhotoFrame, Placeholder, SectionHeader } from "@/components/ui";
import type { Photo } from "@/lib/images";

/**
 * Profile card row: portrait, then the name/credentials slot, then a one-line
 * description.
 *
 * Every slot is a labelled placeholder. Nothing here is invented — no stand-in
 * name, no stock portrait — because a placeholder name still reads as a name,
 * and a stock headshot still reads as a person. The card carries no link
 * either: there is nothing real to point at yet.
 */
export function ProfileGrid({
  index,
  eyebrow,
  title,
  intro,
  photos,
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  photos: Photo[];
}) {
  return (
    <section className="bg-cream text-ink">
      <div className="wrap">
        <SectionHeader index={index} eyebrow={eyebrow} />

        <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair">
          <h2 className="type-h2 lg:col-span-2 py-16 lg:py-24 lg:pr-10">
            {title}
          </h2>
          {intro && (
            <div className="lg:col-span-2 lg:border-l border-hair lg:pl-8 pb-16 lg:py-24">
              {intro}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {photos.map((photo, i) => (
            <article
              key={i}
              className={`flex flex-col gap-6 py-14 sm:px-6 lg:px-5 first:sm:pl-0 first:lg:pl-0 border-t sm:border-t-0 border-hair ${
                i > 0 ? "sm:border-l border-hair" : ""
              }`}
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              {/* Fixed height, not an aspect ratio: the first card sits flush
                  to the grid edge and so is wider, which an aspect ratio would
                  turn into a taller photo than the rest of the row. */}
              <PhotoFrame
                photo={photo}
                greyscale
                className="h-72 lg:h-[22rem]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              {/* Name and credentials — the serif slot on a finished card. */}
              <Placeholder lead />
              {/* One-line description. */}
              <Placeholder />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
