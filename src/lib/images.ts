import type { CSSProperties } from "react";

/**
 * Which of the site's two text treatments a photo-backed section uses.
 *
 * The site never carries more than two on any one background, so this is a
 * pair rather than a colour: `light` is white copy, `dark` is `--color-ink`,
 * the near-black olive already used on cream. It is the editor's choice, made
 * per slot in the admin, and it is what decides legibility — the scrim below
 * only helps.
 */
export type TextMode = "light" | "dark";

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
   * It sizes the scrim to the picture instead of to the worst case, and feeds
   * the contrast estimate the admin shows beside the text-mode toggle. Note
   * what it is and is not: the brightest region is the worst case for *white*
   * copy and the easiest case for *ink* copy, so the estimate is a floor in
   * light mode and a ceiling in dark mode. The admin says so on the field.
   *
   * `null` means unmeasured — an Unsplash slot, or anything stored before this
   * existed — and is treated as a white photograph. Guessing light on an
   * unknown photograph is the one failure that puts unreadable white text on
   * the page.
   */
  brightness: number | null;
  /**
   * Light or dark copy over this photograph. Every slot carries it so the
   * shape stays uniform, but it only does anything where the section actually
   * holds text over the image — `textOverPhoto()` in `admin/schema.ts` is the
   * list, and it is what decides whether the admin offers the toggle.
   *
   * Typed `string` rather than `TextMode` for one specific reason: the loaders
   * in `src/lib/*.ts` assign the imported JSON straight to the page's content
   * type, and that assignment is the whole-file structural check the build
   * relies on. A JSON import widens `"light"` to `string`, so a narrower type
   * here would force a cast in seven loaders and throw that check away to buy
   * a guarantee the save-time validator already gives. Every reader goes
   * through `storedMode()` instead, which treats anything that is not `dark`
   * as light — the same forgiveness `Icon` gives an unrecognised mark, and in
   * the same safe direction.
   */
  textMode: string;
};

/* ---- The scrim ---------------------------------------------------------
 *
 * The overlay used to be the whole legibility guarantee: it was solved to
 * bring the background behind the copy to 0.081 luminance whatever the
 * photograph, which on a bright image meant a 0.42 wash plus a 0.86 field —
 * composing to 0.92, near enough black. It worked, and it cost the picture
 * almost everything.
 *
 * The text mode carries that job now, so this is a light touch: a photograph
 * is never left completely unprotected, and it is never darkened far enough
 * to stop being a photograph. Brightness still scales it — a bright image
 * gets more help than a dark one — the whole curve is simply much lower.
 *
 * Two thresholds, mirror images of each other about mid-grey:
 *
 * - light copy: hold the brightest region at or below `LIGHT_CEILING`, which
 *   is about 3.4:1 for white text. Short of AA on purpose; AA over a
 *   photograph is what the editor's own eye and the contrast reading in the
 *   admin are for now.
 * - dark copy: lift it to at least `DARK_FLOOR`, about 6.8:1 for ink.
 *
 * Alphas are solved in sRGB channel space rather than in luminance, because
 * that is where a browser actually composites an overlay. `brightness` is a
 * relative luminance, so it is converted across; the old code multiplied the
 * luminance directly, which overstated what an overlay does by roughly an
 * order of magnitude and is part of why the result was so heavy.
 */

/** Light copy: the wash holds the brightest region at or below this. */
const LIGHT_CEILING = 0.26;
/** Dark copy: the wash lifts the brightest region to at least this. */
const DARK_FLOOR = 0.62;
/** No photograph is ever completely unprotected. */
const MIN_TOTAL = 0.15;
/** …and none is ever darkened or bleached past a light touch. */
const MAX_TOTAL = 0.5;
/**
 * How much of the total the section-wide wash takes; the field under the copy
 * composes over it to the rest. The wash covers the whole picture, so it is
 * the layer that costs the photograph most — it gets the smaller share.
 */
const WASH_SHARE = 0.35;

/** Relative luminance of `--color-ink` (#3e4032), the dark text colour. */
const INK_LUMINANCE = 0.0492;

/** sRGB transfer function: relative luminance → channel value, and back. */
function toChannel(luminance: number): number {
  return luminance <= 0.0031308
    ? luminance * 12.92
    : 1.055 * luminance ** (1 / 2.4) - 0.055;
}

function toLuminance(channel: number): number {
  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
}

function clampUnit(n: number): number {
  return Math.min(1, Math.max(0, n));
}

/** The stored mode, normalised. Anything that is not `dark` is light. */
export function storedMode(photo: Photo): TextMode {
  return photo.textMode === "dark" ? "dark" : "light";
}

/**
 * The mode a slot actually renders in. An empty slot shows its labelled
 * pending frame on the dark ramp, where white is the only legible colour — so
 * a stored `dark` describes a photograph that is not there yet, and is
 * ignored until one is.
 */
export function activeMode(photo: Photo): TextMode {
  return photo.src !== null ? storedMode(photo) : "light";
}

/** Total alpha of the scrim where the copy sits — wash and field combined. */
export function scrimTotal(photo: Photo): number {
  const g = toChannel(clampUnit(photo.brightness ?? 1));
  const want =
    activeMode(photo) === "dark"
      ? g >= 1
        ? 0
        : (toChannel(DARK_FLOOR) - g) / (1 - g)
      : g <= 0
        ? 0
        : 1 - toChannel(LIGHT_CEILING) / g;
  return Math.min(MAX_TOTAL, Math.max(MIN_TOTAL, want));
}

/**
 * Roughly what contrast the copy gets against this photograph, as a ratio.
 *
 * Guidance, not a guarantee, and it is only ever measured against the
 * brightest region — the one number stored. In light mode that is the worst
 * case and the estimate is a floor. In dark mode it is the *best* case: the
 * dark parts of the same picture will read worse, and nothing here knows how
 * dark they are.
 */
export function estimateContrast(photo: Photo): number {
  const g = toChannel(clampUnit(photo.brightness ?? 1));
  const total = scrimTotal(photo);
  const behind =
    activeMode(photo) === "dark"
      ? toLuminance(g + (1 - g) * total)
      : toLuminance(g * (1 - total));
  return activeMode(photo) === "dark"
    ? (behind + 0.05) / (INK_LUMINANCE + 0.05)
    : 1.05 / (behind + 0.05);
}

/**
 * Custom properties, which `CSSProperties` does not name on its own.
 *
 * These hold whole colours rather than alphas, because the scrim is black
 * under light copy and white under dark copy — an alpha alone cannot say
 * which. `--scrim-clear` is the same colour at zero alpha, and exists so a
 * gradient fades out to its own hue: `transparent` is `rgba(0,0,0,0)`, which
 * would put a grey fringe through a white scrim.
 */
export type ScrimVars = CSSProperties &
  Record<"--scrim-wash" | "--scrim-field" | "--scrim-clear", string>;

export function scrimVars(photo: Photo): ScrimVars {
  const total = scrimTotal(photo);
  const wash = total * WASH_SHARE;
  const field = 1 - (1 - total) / (1 - wash);
  const rgb = activeMode(photo) === "dark" ? "255, 255, 255" : "0, 0, 0";
  return {
    "--scrim-wash": `rgba(${rgb}, ${wash.toFixed(4)})`,
    "--scrim-field": `rgba(${rgb}, ${field.toFixed(4)})`,
    "--scrim-clear": `rgba(${rgb}, 0)`,
  };
}

/**
 * How copy over this photograph is coloured — one object, read by the whole
 * section, so a headline and its CTA and the nav above it cannot disagree.
 *
 * Nothing over a photograph may be dimmer than 75% white, or 80% ink; the
 * scrim is a light touch now and a quiet secondary line is the first thing to
 * disappear under a bright image.
 */
export type PhotoText = {
  mode: TextMode;
  /** Section background, showing only where the photograph does not. */
  surface: string;
  /** Tone for the shared primitives, which derive everything from it. */
  tone: "cream" | "ramp";
  /** Headline, lead — anything at full strength. */
  strong: string;
  /** Secondary paragraphs. */
  body: string;
  /** Eyebrows and small labels. */
  label: string;
  /** The hairline grid drawn over the photograph. */
  rule: string;
  /** Which `PillButton` variant the section's CTA takes. */
  pill: "outline" | "outline-ink";
};

/**
 * `body` and `label` are a hair apart and that is not an accident: the two
 * values are what these sections already used before the mode existed, and
 * every photograph on the site defaults to light, so keeping them distinct is
 * what makes "nothing changes until an editor picks a mode" literally true.
 */
export function photoText(photo: Photo): PhotoText {
  const dark = activeMode(photo) === "dark";
  return {
    mode: dark ? "dark" : "light",
    surface: dark ? "bg-cream text-ink" : "bg-ramp text-white",
    tone: dark ? "cream" : "ramp",
    strong: dark ? "text-ink" : "text-white",
    body: dark ? "text-ink/85" : "text-white/80",
    label: dark ? "text-ink/80" : "text-white/75",
    rule: dark ? "border-ink/20" : "border-white/15",
    pill: dark ? "outline-ink" : "outline",
  };
}
