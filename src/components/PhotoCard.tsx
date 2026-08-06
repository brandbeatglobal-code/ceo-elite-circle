import Image from "next/image";
import { ArrowLink, BulletLabel } from "@/components/ui";
import { activeMode, scrimVars, type Photo } from "@/lib/images";

/**
 * Tall card with a photograph behind the content, revealed on hover.
 *
 * The photograph is decorative: every word on the card is present and legible
 * whether or not it is showing, so nothing is hidden behind a hover. On touch,
 * where there is no hover, the image is shown by default (see `.photo-card`
 * in globals.css) rather than being unreachable.
 *
 * The scrim (see `.photo-card-scrim` in globals.css) is the same wash-plus-
 * field pair the full-bleed sections use, sized to this photograph; the
 * middle band is empty by construction and stays light.
 *
 * The slot's text mode reaches here as `.photo-card-ink`, which changes the
 * copy colour on exactly the selectors the photograph fades on — because off
 * hover there is no photograph, only the black section the card sits in,
 * where white is the only legible colour. That is why the card's copy takes
 * its colour from CSS custom properties rather than from a `tone`: there is
 * no single answer for the life of the component.
 */
export function PhotoCard({
  label,
  index,
  title,
  body,
  photo,
  href,
  linkLabel,
  delay = 0,
}: {
  label: string;
  index: string;
  title: string;
  body: string;
  photo: Photo;
  href: string;
  linkLabel: string;
  delay?: number;
}) {
  const ink = photo.src !== null && activeMode(photo) === "dark";
  return (
    <article
      className={`photo-card group relative overflow-hidden flex flex-col justify-between min-h-[20rem] lg:min-h-[34rem] pt-8 pb-10 lg:pt-10 lg:pb-12 px-6 lg:px-7 ${
        ink ? "photo-card-ink" : ""
      }`}
      data-reveal
      style={
        photo.src
          ? { transitionDelay: `${delay}ms`, ...scrimVars(photo) }
          : { transitionDelay: `${delay}ms` }
      }
    >
      {photo.src && (
        <div className="photo-card-media absolute inset-0" aria-hidden="true">
          <Image
            src={photo.src}
            alt=""
            fill
            // A card is a fifth of the container at desktop — never ask the
            // browser for a full-width file.
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
            className="object-cover"
          />
          <div className="photo-card-scrim" />
        </div>
      )}

      <div className="relative card-ink">
        <BulletLabel className="card-ink-faint">{label}</BulletLabel>
        <p className="type-body mt-3 pb-5 mb-8 border-b card-rule">{index}</p>
        <p className="type-body card-ink-soft">{body}</p>
      </div>

      {/* Five cards in a row all read "Discover the Circle" and go to five
          different pillars. The title is directly above the link, so a sighted
          visitor never has to ask which is which; in a screen reader's list of
          links that context is gone. The name is taken from the card's own
          title rather than passed in, so it cannot disagree with the heading
          it sits under. */}
      <div className="relative mt-14 card-ink">
        <h3 className="type-display type-h3 mb-5">{title}</h3>
        <ArrowLink href={href} inherit ariaLabel={`${linkLabel}: ${title}`}>
          {linkLabel}
        </ArrowLink>
      </div>
    </article>
  );
}
