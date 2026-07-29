import { ReactNode } from "react";
import { SectionHeader, Placeholder, type Tone } from "@/components/ui";

export { Placeholder };

/**
 * The standard inner-page section: header row (index / eyebrow / link) over a
 * two-column body — sans headline on the left, copy on the right.
 */
export function Section({
  index,
  eyebrow,
  title,
  children,
  tone = "cream",
  link,
}: {
  index: string;
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  tone?: Tone;
  link?: { href: string; label: string };
}) {
  const dark = tone !== "cream";

  return (
    <section
      className={`${
        tone === "black"
          ? "bg-black"
          : tone === "ramp"
            ? "bg-ramp"
            : tone === "ramp-low"
              ? "bg-ramp-low"
              : "bg-cream"
      } ${dark ? "text-white" : "text-ink"}`}
    >
      <div className="wrap">
        <SectionHeader
          index={index}
          eyebrow={eyebrow ?? title}
          link={link}
          tone={tone}
        />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-8">
          <h2
            className={`type-h2 py-12 lg:py-28 lg:col-span-2 lg:pr-10 ${
              dark ? "text-white" : "text-ink"
            }`}
            data-reveal
          >
            {title}
          </h2>
          <div
            className={`lg:col-span-2 lg:border-l ${
              dark ? "border-hair-dark" : "border-hair"
            } lg:pl-10 pb-12 lg:py-28 flex flex-col items-start gap-8 max-w-2xl`}
            data-reveal
            style={{ transitionDelay: "90ms" }}
          >
            {children ?? <Placeholder tone={tone} />}
          </div>
        </div>
      </div>
    </section>
  );
}
