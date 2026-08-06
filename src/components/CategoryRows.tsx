import { ArrowLink, BulletLabel, PhotoFrame, hair, isDark } from "@/components/ui";
import type { Tone } from "@/components/ui";
import type { Photo } from "@/lib/images";

/**
 * The membership categories, as a row per category.
 *
 * Two pages render this: `/membership`, where it is the section, and the
 * homepage, where it is a teaser. Both read the same three categories from
 * `content/membership.json`, so the content could never drift; the *markup*
 * could, and did. The name was moved into the left column on `/membership`
 * and the homepage kept the old shape, which is exactly the failure this
 * component exists to prevent.
 *
 * What legitimately differs between the two is passed in, and nothing else:
 * the tone, and the link each row carries. `/membership` sends a visitor to
 * the application form; the homepage sends them on to `/membership`. Colours
 * are never passed — they are derived from `tone` through `isDark()` and
 * `hair()`, the way every other primitive in this codebase does it.
 */
export type Category = {
  name: string;
  body: string;
  photo: Photo;
};

export function CategoryRows({
  items,
  rowLabel,
  link,
  tone = "cream",
  reveal = false,
}: {
  items: Category[];
  /** Sits above each name, saying what kind of thing the row is. */
  rowLabel: string;
  /** Where this page's rows point, and what the link says. */
  link: { href: string; label: string };
  tone?: Tone;
  /** `/membership` staggers its rows in; the homepage teaser does not. */
  reveal?: boolean;
}) {
  const dark = isDark(tone);
  const rule = hair(tone);

  return (
    <>
      {items.map((tier, i) => (
        <div
          key={tier.name}
          className={`grid grid-cols-1 lg:grid-cols-4 border-b ${rule}`}
          {...(reveal
            ? { "data-reveal": true, style: { transitionDelay: `${i * 70}ms` } }
            : {})}
        >
          {/* The name leads the row, at the weight pillar and experience
              names carry elsewhere, so a visitor scanning down reads what
              each tier *is* before what it includes. The label stays above
              it: without one the column opens on a bare name. */}
          <div className="flex flex-col justify-between py-16 lg:py-14 lg:pr-8 gap-8">
            <div>
              <BulletLabel className={dark ? "text-white/60" : "text-olive"}>
                {rowLabel}
              </BulletLabel>
              <h3
                className={`type-display type-h3 ${dark ? "text-white" : "text-ink"} mt-5`}
              >
                {tier.name}
              </h3>
            </div>
            <ArrowLink href={link.href} {...(dark ? { tone } : {})}>
              {link.label}
            </ArrowLink>
          </div>

          <div className={`lg:col-span-2 lg:border-l ${rule} lg:pl-8 py-16 lg:py-14`}>
            <p className={`type-lead ${dark ? "text-white" : "text-ink"} max-w-md`}>
              {tier.body}
            </p>
          </div>

          <div className={`lg:border-l ${rule} lg:pl-8 py-16 lg:py-14`}>
            <PhotoFrame
              photo={tier.photo}
              {...(dark ? { tone } : {})}
              greyscale
              {...(dark ? { hover: true } : {})}
              className="h-40 lg:h-44"
              sizes="(max-width: 1024px) 100vw, 25vw"
            />
          </div>
        </div>
      ))}
    </>
  );
}
