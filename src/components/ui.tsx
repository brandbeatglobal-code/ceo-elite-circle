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
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const base = isDark(tone)
    ? "text-white hover:text-sage"
    : "text-ink hover:text-sage";
  return (
    <Link
      href={href}
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
  variant?: "light" | "dark" | "outline";
  className?: string;
}) {
  const styles = {
    light: "bg-white text-ink hover:bg-mint",
    dark: "bg-ink text-white hover:bg-sage",
    outline: "border border-white/35 text-white hover:bg-white hover:text-ink",
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
          Photography pending — {photo.note}
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
}: {
  tone?: Tone;
  lead?: boolean;
  /** Replaces the default sentence when a slot has a stricter requirement. */
  note?: string;
}) {
  const dark = isDark(tone);
  return (
    <p
      className={`${lead ? "type-lead" : "type-body"} italic border border-dashed px-4 py-3 ${
        lead ? "max-w-sm" : "max-w-md"
      } ${dark ? "border-white/25 text-white/55" : "border-hair text-olive"}`}
    >
      {note ??
        "Content placeholder — copy for this section is still to be drafted and reviewed."}
    </p>
  );
}
