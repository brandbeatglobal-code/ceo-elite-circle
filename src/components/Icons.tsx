/**
 * Line-art icon set.
 *
 * House style, per the confirmed reference: thin single-weight strokes, no
 * fills, built from plain geometry — arcs, rings, diamonds, ellipses. Abstract,
 * never illustrative or literal. Any icon added later belongs in this file and
 * follows the same rules.
 *
 * Icons inherit colour from `currentColor` and scale with the box they're
 * given. `non-scaling-stroke` keeps the stroke a true hairline at every size,
 * rather than thickening as the box grows.
 *
 * Each mark carries a meaning, written above it. That is what makes an
 * assignment checkable: a mark is chosen because it says what its label says,
 * not because it is next in the list. Two sections landing on the same mark is
 * fine when the concepts really are the same — the thing to avoid is the same
 * sequence repeating under unrelated words.
 */
type IconProps = { className?: string };

const svgProps = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
  focusable: "false" as const,
};

const hairline = { vectorEffect: "non-scaling-stroke" as const };

/** Opposed nested arcs — a meeting point; counsel given and taken. */
export function IconArcs({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path {...hairline} d="M3 18a21 21 0 0 1 42 0" />
      <path {...hairline} d="M12 18a12 12 0 0 1 24 0" />
      <path {...hairline} d="M20 18a4 4 0 0 1 8 0" />
      <path {...hairline} d="M3 30a21 21 0 0 0 42 0" />
      <path {...hairline} d="M12 30a12 12 0 0 0 24 0" />
      <path {...hairline} d="M20 30a4 4 0 0 0 8 0" />
    </svg>
  );
}

/** Concentric rings — the Circle itself; a bounded set, being inside it. */
export function IconRings({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle {...hairline} cx="24" cy="24" r="22" />
      <circle {...hairline} cx="24" cy="24" r="13.5" />
      <circle {...hairline} cx="24" cy="24" r="5" />
    </svg>
  );
}

/** Stacked diamonds — accumulation; something built up over time. */
export function IconStack({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path {...hairline} d="M24 2 46 15 24 28 2 15Z" />
      <path {...hairline} d="M2 24 24 37 46 24" />
      <path {...hairline} d="M2 33 24 46 46 33" />
    </svg>
  );
}

/** Stacked ellipses — reach across regions; travel, other markets. */
export function IconOrbit({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <ellipse {...hairline} cx="24" cy="10" rx="22" ry="7" />
      <ellipse {...hairline} cx="24" cy="24" rx="22" ry="7" />
      <ellipse {...hairline} cx="24" cy="38" rx="22" ry="7" />
    </svg>
  );
}

/**
 * An opening in a wall — admission; crossing in.
 *
 * Drawn as an arch rather than as a ring with a gap: a broken ring with a
 * line through the top is the standby glyph, and a mark that borrows a
 * universal meaning is not abstract, it is just wrong.
 */
export function IconThreshold({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path {...hairline} d="M11 44V20" />
      <path {...hairline} d="M37 44V20" />
      <path {...hairline} d="M11 20a13 13 0 0 1 26 0" />
      <path {...hairline} d="M3 44h42" />
    </svg>
  );
}

/**
 * A needle across a ring — direction; judgement; a decision to steer by.
 *
 * The needle lies on the diagonal: upright and symmetrical it reads as an eye
 * once the mark is small.
 */
export function IconCompass({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle {...hairline} cx="24" cy="24" r="21" />
      <path {...hairline} d="M36.5 11.5 27.5 27.5 11.5 36.5 20.5 20.5Z" />
    </svg>
  );
}

/** Lines meeting at one point — the final call; everything narrowing to it. */
export function IconConverge({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path {...hairline} d="M5 5 22.6 37.4" />
      <path {...hairline} d="M24 3v34" />
      <path {...hairline} d="M43 5 25.4 37.4" />
      <circle {...hairline} cx="24" cy="40" r="3.2" />
    </svg>
  );
}

/** A divided diamond — structure; a framework; a shared discipline. */
export function IconLattice({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path {...hairline} d="M24 2 46 24 24 46 2 24Z" />
      <path {...hairline} d="M2 24h44" />
      <path {...hairline} d="M24 2v44" />
    </svg>
  );
}

/** A long rule through a ring — the long view; distance; beyond the quarter. */
export function IconHorizon({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle {...hairline} cx="24" cy="24" r="17" />
      <path {...hairline} d="M1 24h46" />
      <circle {...hairline} cx="36" cy="24" r="3.5" />
    </svg>
  );
}

/** Two overlapping rings — one to one; an introduction; counsel between two. */
export function IconPair({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle {...hairline} cx="17" cy="24" r="15" />
      <circle {...hairline} cx="31" cy="24" r="15" />
    </svg>
  );
}

/** A ring above nested diamonds — distinction; standing; recognition. */
export function IconCrest({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle {...hairline} cx="24" cy="7" r="5" />
      <path {...hairline} d="M24 15 41 30.5 24 46 7 30.5Z" />
      <path {...hairline} d="M24 23 33 30.5 24 38 15 30.5Z" />
    </svg>
  );
}

/** Marks rising along a diagonal — progression; a transition; stepping up. */
export function IconAscent({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path {...hairline} d="M4 44 9.6 38.4" />
      <path {...hairline} d="M14.4 33.6 21.6 26.4" />
      <path {...hairline} d="M26.4 21.6 33.6 14.4" />
      <path {...hairline} d="M38.4 9.6 44 4" />
      <circle {...hairline} cx="12" cy="36" r="3.4" />
      <circle {...hairline} cx="24" cy="24" r="3.4" />
      <circle {...hairline} cx="36" cy="12" r="3.4" />
    </svg>
  );
}

/** Arcs spreading from a point — something carried between people: said, heard. */
export function IconSignal({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle {...hairline} cx="8" cy="40" r="2.5" />
      <path {...hairline} d="M8 27A13 13 0 0 1 21 40" />
      <path {...hairline} d="M8 18A22 22 0 0 1 30 40" />
      <path {...hairline} d="M8 9A31 31 0 0 1 39 40" />
    </svg>
  );
}

/** Linked rings around a centre — a network; introductions made in both directions. */
export function IconWeave({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle {...hairline} cx="24" cy="27" r="6" />
      <circle {...hairline} cx="24" cy="6" r="4" />
      <circle {...hairline} cx="6" cy="40" r="4" />
      <circle {...hairline} cx="42" cy="40" r="4" />
      <path {...hairline} d="M24 21V10" />
      <path {...hairline} d="M18.9 30.2 9.4 37.9" />
      <path {...hairline} d="M29.1 30.2 38.6 37.9" />
    </svg>
  );
}

/** A ring held inside a boundary — a closed room; what is said stays. */
export function IconChamber({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path {...hairline} d="M24 3 45 24 24 45 3 24Z" />
      <circle {...hairline} cx="24" cy="24" r="7" />
    </svg>
  );
}

/** A ring in segments — a recurring year; a round returned to, not yet closed. */
export function IconCycle({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path {...hairline} d="M24 4A20 20 0 0 1 43.7 27.5" />
      <path {...hairline} d="M41.3 34A20 20 0 0 1 11.1 39.3" />
      <path {...hairline} d="M6.7 34A20 20 0 0 1 17.2 5.2" />
    </svg>
  );
}

/** A line resting on a shallow open arc — a foundation; what the rest stands on. */
export function IconAnchor({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path {...hairline} d="M24 6V30" />
      <path {...hairline} d="M8 30A26 26 0 0 0 40 30" />
    </svg>
  );
}

/**
 * Short arcs closing in on a small open centre — precision; sharp focus.
 *
 * Three arcs, each at its own radius and its own angle. A first pass used four
 * and put two of them on the same radius: at 20px the arcs crowded into a
 * smudge, and the matched pair read as a broken ring, which is `cycle`.
 */
export function IconAperture({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle {...hairline} cx="24" cy="24" r="4.5" />
      <path {...hairline} d="M13.4 21.2A11 11 0 0 1 31.8 16.2" />
      <path {...hairline} d="M40 29.8A17 17 0 0 1 11 34.9" />
      <path {...hairline} d="M13 4.9A22 22 0 0 1 46 24" />
    </svg>
  );
}

/** Ruled lines of differing length — a record kept; what is tracked. */
export function IconLedger({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path {...hairline} d="M8 11h32" />
      <path {...hairline} d="M8 20h22" />
      <path {...hairline} d="M8 29h32" />
      <path {...hairline} d="M8 38h14" />
    </svg>
  );
}

/**
 * A ring with a line rising from it — a point reached; progress marked.
 *
 * The line rises rather than trailing off at a diagonal: a ring with a
 * diagonal handle is the magnifier glyph, and a borrowed meaning is not
 * abstract, it is just wrong. Same reasoning as `threshold` and `compass`.
 */
export function IconWaypoint({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle {...hairline} cx="24" cy="35" r="9" />
      <path {...hairline} d="M24 26V4" />
    </svg>
  );
}

/** A wide shallow arc between two marks — reach; distant points connected. */
export function IconSpan({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle {...hairline} cx="6" cy="30" r="3" />
      <circle {...hairline} cx="42" cy="30" r="3" />
      <path {...hairline} d="M9 28A30 30 0 0 1 39 28" />
    </svg>
  );
}

/**
 * A closed circle inside a frame left open — the essential part; what is
 * irreducible.
 *
 * The frame is broken at its corners rather than mid-edge: four L-shaped
 * corner pieces are the crop-mark glyph, which is the borrowed meaning to
 * avoid here.
 */
export function IconKernel({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path {...hairline} d="M14 4h20" />
      <path {...hairline} d="M14 44h20" />
      <path {...hairline} d="M4 14v20" />
      <path {...hairline} d="M44 14v20" />
      <circle {...hairline} cx="24" cy="24" r="6" />
    </svg>
  );
}

/**
 * Marks stepping down in sequence — succession; something passed forward.
 *
 * Plain strokes descending, where `ascent` is rings rising: the two are
 * deliberately opposite in both direction and mark, since a transition and a
 * handover are near neighbours in meaning and must not be in appearance.
 */
export function IconRelay({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path {...hairline} d="M4 14h12" />
      <path {...hairline} d="M18 23h12" />
      <path {...hairline} d="M32 32h12" />
    </svg>
  );
}

/**
 * Sightlines opening from one point onto a wider edge — perspective; the
 * wider picture.
 *
 * The lines stop short of the bar, and the bar overhangs them by nine units
 * either side. A first pass ran the lines all the way into a bar that barely
 * cleared them, which closed into a plain down-pointing triangle — a play or
 * collapse glyph, and no longer a mark about seeing more than you stand in
 * front of. The gap is what keeps it open.
 */
export function IconVantage({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle {...hairline} cx="24" cy="41" r="2.5" />
      <path {...hairline} d="M24 37 12 18" />
      <path {...hairline} d="M24 37 36 18" />
      <path {...hairline} d="M3 14h42" />
    </svg>
  );
}

/**
 * Content files name an icon by key rather than importing a component: the
 * label and body of a feature are content, the mark above them is design.
 * Adding a key means adding an icon above it first.
 */
export type IconKey =
  | "rings"
  | "arcs"
  | "stack"
  | "orbit"
  | "threshold"
  | "compass"
  | "converge"
  | "lattice"
  | "horizon"
  | "pair"
  | "crest"
  | "ascent"
  | "signal"
  | "weave"
  | "chamber"
  | "cycle"
  | "anchor"
  | "aperture"
  | "ledger"
  | "waypoint"
  | "span"
  | "kernel"
  | "relay"
  | "vantage";

const marks: Record<IconKey, (props: IconProps) => React.ReactElement> = {
  rings: IconRings,
  arcs: IconArcs,
  stack: IconStack,
  orbit: IconOrbit,
  threshold: IconThreshold,
  compass: IconCompass,
  converge: IconConverge,
  lattice: IconLattice,
  horizon: IconHorizon,
  pair: IconPair,
  crest: IconCrest,
  ascent: IconAscent,
  signal: IconSignal,
  weave: IconWeave,
  chamber: IconChamber,
  cycle: IconCycle,
  anchor: IconAnchor,
  aperture: IconAperture,
  ledger: IconLedger,
  waypoint: IconWaypoint,
  span: IconSpan,
  kernel: IconKernel,
  relay: IconRelay,
  vantage: IconVantage,
};

/**
 * What each mark means, in the admin's own words.
 *
 * The picker shows the drawing, which says what it looks like but not what it
 * is *for* — and the whole discipline of this set is that a mark is chosen
 * because it agrees with the words beneath it. So the sentence travels with
 * the mark rather than living only in a comment above its definition, where
 * nobody choosing an icon would ever read it.
 */
export const ICON_MEANINGS: Record<IconKey, string> = {
  rings: "The Circle itself — a bounded set, and being inside it",
  arcs: "A meeting point — counsel given and taken",
  stack: "Accumulation — something built up over time",
  orbit: "Reach across regions — travel, other markets",
  threshold: "Admission — crossing in",
  compass: "Direction — judgement, a decision to steer by",
  converge: "The final call — everything narrowing to one point",
  lattice: "Structure — a framework, a shared discipline",
  horizon: "The long view — distance, beyond the quarter",
  pair: "One to one — an introduction, counsel between two",
  crest: "Distinction — standing, recognition",
  ascent: "Progression — a transition, stepping up",
  signal: "Something carried between people — said, or heard",
  weave: "A network — introductions in both directions",
  chamber: "A closed room — what is said stays",
  cycle: "A recurring year — a round returned to",
  anchor: "A foundation — what the rest stands on",
  aperture: "Precision — sharp focus",
  ledger: "A record kept — what is tracked",
  waypoint: "A point reached — progress marked",
  span: "Reach — distant points connected",
  kernel: "The essential part — what is irreducible",
  relay: "Succession — something passed forward",
  vantage: "Perspective — the wider picture",
};

export const ICON_KEYS = Object.keys(marks) as IconKey[];

export function isIconKey(value: unknown): value is IconKey {
  return typeof value === "string" && value in marks;
}

export function Icon({
  name,
  className = "",
}: IconProps & { name: IconKey | string }) {
  // An unknown key renders the Circle's own mark rather than throwing. The
  // content files are edited through the admin, and a page that will not
  // render is a far worse failure than a mark that is merely wrong.
  const Mark = marks[name as IconKey] ?? IconRings;
  return <Mark className={className} />;
}
