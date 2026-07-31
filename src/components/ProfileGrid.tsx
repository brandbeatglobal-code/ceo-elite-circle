import { ReactNode } from "react";
import { PhotoFrame, SectionHeader } from "@/components/ui";
import type { Photo } from "@/lib/images";

export type ProfileCard = {
  name: string;
  /** The title or credentials line, under the name. */
  title: string;
  /** One short line. The card holds a line, not a paragraph. */
  description: string;
  photo: Photo;
};

/**
 * Profile card row: portrait, then the name, its title line, and a one-line
 * description.
 *
 * These are real, named people. The photographs are not yet — each slot
 * renders the standard pending frame labelled with whose headshot belongs
 * there, which is the honest state rather than a stock face standing in for
 * someone who exists. The card carries no link: the profile template is real
 * but unlinked, and pointing at it would promise a page that has no content
 * for these three.
 *
 * The row sizes itself to however many cards it is given — three columns for
 * three people. It is deliberately not a fixed four with a hole in it, which
 * would read as a fourth person who has gone missing.
 */
export function ProfileGrid({
  index,
  eyebrow,
  title,
  intro,
  cards,
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  cards: ProfileCard[];
}) {
  return (
    <section className="bg-cream text-ink">
      <div className="wrap">
        <SectionHeader index={index} eyebrow={eyebrow} />

        <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair">
          <h2 className="type-h2 lg:col-span-2 py-12 lg:py-24 lg:pr-10">
            {title}
          </h2>
          {intro && (
            <div className="lg:col-span-2 lg:border-l border-hair lg:pl-8 pb-12 lg:py-24">
              {intro}
            </div>
          )}
        </div>

        {/* One column stacked, three across from `md`. Two columns would leave
            an odd card hanging alone on a second row, and `sm` is too narrow
            to carry three names side by side. */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {cards.map((card, i) => (
            <article
              key={card.name}
              className={`flex flex-col gap-6 py-10 lg:py-14 md:px-6 lg:px-8 first:md:pl-0 border-t md:border-t-0 border-hair ${
                i > 0 ? "md:border-l border-hair" : ""
              }`}
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              {/* Fixed height, not an aspect ratio: the first card sits flush
                  to the grid edge and so is wider, which an aspect ratio would
                  turn into a taller photo than the rest of the row. */}
              <PhotoFrame
                photo={card.photo}
                greyscale
                className="h-72 lg:h-[22rem]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              <div className="flex flex-col gap-2">
                <p className="type-lead text-ink">{card.name}</p>
                <p className="type-label text-olive">{card.title}</p>
              </div>

              <p className="type-body text-olive">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
