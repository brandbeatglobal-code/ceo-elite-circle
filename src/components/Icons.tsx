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

/** Opposed nested arcs — a meeting point. */
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

/** Concentric rings — the Circle itself. */
export function IconRings({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle {...hairline} cx="24" cy="24" r="22" />
      <circle {...hairline} cx="24" cy="24" r="13.5" />
      <circle {...hairline} cx="24" cy="24" r="5" />
    </svg>
  );
}

/** Stacked diamonds — accumulated standing. */
export function IconStack({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path {...hairline} d="M24 2 46 15 24 28 2 15Z" />
      <path {...hairline} d="M2 24 24 37 46 24" />
      <path {...hairline} d="M2 33 24 46 46 33" />
    </svg>
  );
}

/** Stacked ellipses — reach across regions. */
export function IconOrbit({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <ellipse {...hairline} cx="24" cy="10" rx="22" ry="7" />
      <ellipse {...hairline} cx="24" cy="24" rx="22" ry="7" />
      <ellipse {...hairline} cx="24" cy="38" rx="22" ry="7" />
    </svg>
  );
}
