import { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  children,
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  tone?: "light" | "stone";
}) {
  return (
    <section className={tone === "stone" ? "bg-stone" : "bg-white"}>
      <div className="wrap py-20 md:py-28">
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.2em] text-gold mb-4">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl md:text-5xl text-forest mb-6 max-w-2xl">
          {title}
        </h2>
        <div className="divider-gold mb-8" />
        <div className="text-ink-soft leading-relaxed max-w-2xl">
          {children ?? <Placeholder />}
        </div>
      </div>
    </section>
  );
}

export function Placeholder() {
  return (
    <p className="italic text-sm text-ink-soft/70 border border-dashed border-stone px-4 py-3 max-w-md">
      Content placeholder — copy for this section is still to be drafted and
      reviewed.
    </p>
  );
}
