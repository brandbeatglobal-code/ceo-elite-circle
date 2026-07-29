import Image from "next/image";
import { ArrowLink, BulletLabel } from "@/components/ui";
import type { Photo } from "@/lib/images";

/**
 * Tall card with a photograph behind the content, revealed on hover.
 *
 * The photograph is decorative: every word on the card is present and legible
 * whether or not it is showing, so nothing is hidden behind a hover. On touch,
 * where there is no hover, the image is shown by default (see `.photo-card`
 * in globals.css) rather than being unreachable.
 *
 * The overlay is deliberately heavy. White text over a photograph at 15%
 * effective luminance clears 4.5:1 even where the photograph is pure white,
 * which is the case that usually fails — an average-luminance overlay does
 * not survive a blown-out highlight sitting behind a line of text.
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
  return (
    <article
      className="photo-card group relative overflow-hidden flex flex-col justify-between min-h-[26rem] lg:min-h-[34rem] pt-10 pb-12 px-6 lg:px-7"
      data-reveal
      style={{ transitionDelay: `${delay}ms` }}
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
          <div className="absolute inset-0 bg-black/85" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
      )}

      <div className="relative">
        <BulletLabel className="text-white/60">{label}</BulletLabel>
        <p className="type-body text-white mt-3 pb-5 mb-8 border-b border-hair-dark">
          {index}
        </p>
        <p className="type-body text-white/75">{body}</p>
      </div>

      <div className="relative mt-14">
        <h3 className="type-display type-h3 text-white mb-5">{title}</h3>
        <ArrowLink href={href} tone="black">
          {linkLabel}
        </ArrowLink>
      </div>
    </article>
  );
}
