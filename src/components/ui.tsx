import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import type { Photo } from "@/lib/images";

export type Tone = "cream" | "black" | "ramp" | "ramp-low";

const toneBg: Record<Tone, string> = {
  cream: "bg-cream",
  black: "bg-black",
  ramp: "bg-ramp",
  "ramp-low": "bg-ramp-low",
};

export function isDark(tone: Tone) {
  return tone !== "cream";
}

/** Hairline colour for the grid rules, which flips with the section tone. */
export function hair(tone: Tone) {
  return isDark(tone) ? "border-hair-dark" : "border-hair";
}

/**
 * The section header row, identical everywhere: running index at far left,
 * bulleted eyebrow starting at the half-way rule, optional arrow link flush
 * right. Vertical hairlines at the quarter and the half.
 */
export function SectionHeader({
  index,
  eyebrow,
  link,
  tone = "cream",
}: {
  index: string;
  eyebrow: string;
  link?: { href: string; label: string };
  tone?: Tone;
}) {
  const rule = hair(tone);
  const muted = isDark(tone) ? "text-white/70" : "text-olive";

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 border-b ${rule}`}>
      <div className={`type-label ${muted} py-6 pr-4`}>{index}</div>
      <div className={`hidden lg:block border-l ${rule}`} />
      <div className={`type-label ${muted} py-6 lg:border-l ${rule} lg:pl-6`}>
        <span className="text-sage">•</span> {eyebrow}
      </div>
      <div className="hidden lg:flex items-center justify-end py-6">
        {link && <ArrowLink href={link.href} tone={tone}>{link.label}</ArrowLink>}
      </div>
    </div>
  );
}

/** A whole section: tone background + header row + body. */
export function SectionShell({
  index,
  eyebrow,
  link,
  tone = "cream",
  children,
  className = "",
}: {
  index: string;
  eyebrow: string;
  link?: { href: string; label: string };
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`${toneBg[tone]} ${isDark(tone) ? "text-white" : "text-ink"}`}>
      <div className="wrap">
        <SectionHeader index={index} eyebrow={eyebrow} link={link} tone={tone} />
        <div className={className}>{children}</div>
      </div>
    </section>
  );
}

export function ArrowLink({
  href,
  children,
  tone = "cream",
  inherit = false,
  ariaLabel,
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: Tone;
  /**
   * Take the colour of whatever it sits in rather than from a tone. For the
   * one case a tone cannot describe: a photo card whose copy colour changes
   * with the photograph fading in behind it, so there is no single answer
   * for the life of the component.
   */
  inherit?: boolean;
  /**
   * For a link the visible text alone does not place: one whose destination
   * moves, or one of several siblings carrying the same words. Must begin with
   * the visible text, so the accessible name still contains the label a person
   * reads and speech control still reaches it.
   */
  ariaLabel?: string;
  className?: string;
}) {
  const base = inherit
    ? "hover:text-sage"
    : isDark(tone)
      ? "text-white hover:text-sage"
      : "text-ink hover:text-sage";
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`type-link inline-flex items-center gap-1.5 transition-colors ${base} ${className}`}
    >
      {children}
      <span aria-hidden="true">↗</span>
    </Link>
  );
}

/** The only rounded element on the page. */
export function PillButton({
  href,
  children,
  variant = "light",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "light" | "dark" | "outline" | "outline-ink";
  className?: string;
}) {
  const styles = {
    light: "bg-white text-ink hover:bg-mint",
    dark: "bg-ink text-white hover:bg-sage",
    outline: "border border-white/35 text-white hover:bg-white hover:text-ink",
    // The outline pill over a photograph carrying dark copy. Same shape, same
    // weight; only the ink changes, so a section reads as one unit.
    "outline-ink": "border border-ink/35 text-ink hover:bg-ink hover:text-white",
  }[variant];

  return (
    <Link
      href={href}
      className={`pill type-link inline-flex items-center justify-center gap-2 px-8 py-4 transition-colors ${styles} ${className}`}
    >
      <span aria-hidden="true">•</span>
      {children}
    </Link>
  );
}

/** Small bulleted label — the recurring "• London" motif. */
export function BulletLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`type-label ${className}`}>
      <span className="text-sage">•</span> {children}
    </span>
  );
}

/**
 * A photograph, or a labelled frame when the slot has no confirmed image yet.
 * The frame is deliberate and on-system — never a broken <img>.
 */
export function PhotoFrame({
  photo,
  className = "",
  sizes = "(max-width: 1024px) 100vw, 50vw",
  greyscale = false,
  tone = "cream",
  cover = false,
  hover = false,
}: {
  photo: Photo;
  className?: string;
  sizes?: string;
  greyscale?: boolean;
  tone?: Tone;
  /**
   * Fill the nearest positioned ancestor, for photographs used as a section
   * background. Owns the `position` utility either way — callers must not pass
   * `relative`/`absolute` in `className`, or the two collide and Tailwind
   * resolves it by stylesheet order rather than by intent.
   */
  cover?: boolean;
  /** Slight scale and brightness lift on hover. Off for background photos. */
  hover?: boolean;
}) {
  const position = cover ? "absolute inset-0" : "relative";

  if (!photo.src) {
    const dark = isDark(tone);
    return (
      <div
        className={`${position} w-full overflow-hidden border border-dashed flex items-end p-4 ${
          dark ? "border-white/25 bg-white/[0.04]" : "border-hair bg-mint/40"
        } ${className}`}
      >
        <p
          className={`type-label italic ${dark ? "text-white/55" : "text-olive"}`}
        >
          Photography pending. {photo.note}
        </p>
      </div>
    );
  }

  // The tinted backdrop shows through if the remote image ever fails to load,
  // so a bad URL degrades to a quiet block rather than a white hole.
  return (
    <div
      className={`${position} w-full overflow-hidden ${
        hover ? "hover-media" : ""
      } ${isDark(tone) ? "bg-white/[0.05]" : "bg-mint/40"} ${className}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        className={`object-cover ${greyscale ? "grayscale" : ""}`}
      />
    </div>
  );
}

/**
 * Explicit, honest stand-in for copy that has not been drafted yet.
 * `lead` occupies the serif lead-paragraph slot, so the type contrast the
 * layout is built around survives until real copy lands.
 */
export function Placeholder({
  tone = "cream",
  lead = false,
  note,
  onPhoto = false,
}: {
  tone?: Tone;
  lead?: boolean;
  /** Replaces the default sentence when a slot has a stricter requirement. */
  note?: string;
  /**
   * Sitting over a photograph rather than a flat section. 55% white clears
   * 4.5:1 comfortably on the near-black ramp; behind the scrim on a bright
   * photograph it does not, so the floor over an image is 80%. Olive is the
   * same case on the light side — comfortable on cream, marginal over a
   * photograph — so it goes to full ink there.
   */
  onPhoto?: boolean;
}) {
  const dark = isDark(tone);
  const ink = dark
    ? onPhoto
      ? "border-white/40 text-white/80"
      : "border-white/25 text-white/55"
    : onPhoto
      ? "border-ink/40 text-ink"
      : "border-hair text-olive";
  return (
    <p
      className={`${lead ? "type-lead" : "type-body"} italic border border-dashed px-4 py-3 ${
        lead ? "max-w-sm" : "max-w-md"
      } ${ink}`}
    >
      {note ??
        "Content placeholder. Copy for this section is still to be drafted and reviewed."}
    </p>
  );
}
