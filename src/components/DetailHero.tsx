import { BulletLabel, PhotoFrame, PillButton, Placeholder } from "@/components/ui";
import { photoText, scrimVars, type Photo } from "@/lib/images";

/**
 * Detail-page hero: serif title held high over a full-bleed photograph, a
 * short intro to the right, and the full-width pill running along the bottom.
 * Used consistently across every pillar and experience detail page.
 *
 * Copy colour is the slot's `textMode`, read once and applied to the whole
 * section — title, intro and the pill's border and label together. The nav is
 * already solid on these routes, so there is nothing above to keep in step.
 */
export function DetailHero({
  eyebrow,
  title,
  summary,
  photo,
}: {
  eyebrow: string;
  title: string;
  summary?: string;
  photo: Photo;
}) {
  // No photograph, no scrim — see `PhotoHero` for the reasoning.
  const scrim = photo.src !== null;
  const t = photoText(photo);
  return (
    <section
      className={`relative min-h-[calc(88svh-var(--banner-h))] flex flex-col overflow-hidden ${t.surface}`}
      style={scrim ? scrimVars(photo) : undefined}
    >
      <PhotoFrame photo={photo} tone={t.tone} cover className="h-full" sizes="100vw" />
      {scrim && <div className="photo-scrim" />}

      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        <div className="wrap h-full grid grid-cols-4">
          <div />
          <div className={`border-l ${t.rule}`} />
          <div className={`border-l ${t.rule}`} />
          <div className={`border-l ${t.rule}`} />
        </div>
      </div>

      {/* Copy sits at both ends of this hero, so it takes two fields rather
          than one — solid where the words are, fading through the empty
          middle so the photograph still reads. */}
      <div className="relative flex-1 flex flex-col justify-between">
        <div className={`pt-36 lg:pt-44 ${scrim ? "copy-scrim-top" : ""}`}>
          <div className="wrap grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-3">
              <div data-reveal>
                <BulletLabel className={t.label}>{eyebrow}</BulletLabel>
              </div>
              <h1
                className="type-display type-hero mt-6 max-w-4xl"
                data-reveal
                style={{ transitionDelay: "90ms" }}
              >
                {title}
              </h1>
            </div>
            <div
              className="flex items-end"
              data-reveal
              style={{ transitionDelay: "200ms" }}
            >
              {summary ? (
                <p className={`type-body ${t.body} max-w-xs`}>{summary}</p>
              ) : (
                <Placeholder tone={t.tone} onPhoto />
              )}
            </div>
          </div>
        </div>

        <div className={scrim ? "copy-scrim-band" : ""}>
          <div className="wrap hero-foot" data-reveal style={{ transitionDelay: "280ms" }}>
            <PillButton href="/contact" variant={t.pill} className="w-full mt-12">
              Request Membership Consideration
            </PillButton>
          </div>
        </div>
      </div>
    </section>
  );
}
