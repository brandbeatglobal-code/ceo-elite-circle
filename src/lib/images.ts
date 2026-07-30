import type { CSSProperties } from "react";

/**
 * The shape of every photographic slot on the site.
 *
 * Slots themselves live in `content/*.json`, on the page or the item they
 * belong to — there is no central register any more, because "which photo sits
 * on the About hero" is About's content rather than a global.
 *
 * `src` is a URL or a path under `/public`. A slot with `src: null` renders a
 * labelled "photography pending" frame instead of an image, so a missing photo
 * reads as deliberate rather than broken. Filling one is a one-line edit to
 * the JSON — through the admin from Phase 4, by hand until then.
 */
export type Photo = {
  src: string | null;
  alt: string;
  /** What this slot wants, for whoever fills it in. */
  note: string;
  /**
   * How bright the photograph actually is, 0–1: the relative luminance of the
   * brightest *region* in it, measured on upload (see `admin/images.ts`).
   *
   * It exists so a scrim can be sized to the picture instead of to the worst
   * case. Text over a photograph needs the background held below a fixed
   * luminance; a fixed overlay reaches that by multiplying, which crushes an
   * already-dark photograph to nothing while barely saving a bright one.
   *
   * `null` means unmeasured — an Unsplash slot, or anything stored before this
   * existed — and is treated as the worst case, full strength. Guessing light
   * on an unknown photograph is the one failure that puts unreadable text on
   * the page.
   */
  brightness: number | null;
};

/**
 * How dark the scrim over a photograph has to be, as a pair of alphas.
 *
 * A single ceiling drives both: whatever the photograph is, the background
 * behind the copy is brought to `CEILING` relative luminance and no further.
 * At the worst case (a white photograph) that reproduces the measured
 * treatment exactly — 0.42 wash, 0.86 field, composing to 0.919 — and a dark
 * photograph gets only what it needs to reach the same ceiling, so the picture
 * survives instead of being multiplied into black.
 *
 * `--scrim-base` washes the whole section; `--scrim-copy` is the field the
 * copy sits on, and composes over the base to the total.
 */
const CEILING = 0.081;
/** The wash never darkens more than this, however bright the photograph. */
const MAX_BASE = 0.42;

/** Custom properties, which `CSSProperties` does not name on its own. */
export type ScrimVars = CSSProperties & Record<"--scrim-base" | "--scrim-copy", string>;

export function scrimVars(photo: Photo): ScrimVars {
  const brightness = photo.brightness ?? 1;
  const total = brightness <= CEILING ? 0 : 1 - CEILING / brightness;
  // The wash is a fraction of what the copy field needs — enough to sit the
  // picture back, never more than the field itself.
  const base = Math.min(MAX_BASE, total * 0.45);
  const copy = base >= 1 ? 0 : 1 - (1 - total) / (1 - base);
  return {
    "--scrim-base": base.toFixed(4),
    "--scrim-copy": copy.toFixed(4),
  };
}
