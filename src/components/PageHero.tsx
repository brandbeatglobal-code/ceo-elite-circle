export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="bg-white border-b border-stone">
      <div className="wrap py-20 md:py-28 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-gold mb-4">
          {eyebrow}
        </p>
        <h1 className="text-4xl md:text-6xl text-forest mb-6">{title}</h1>
        <div className="divider-gold mb-6" />
        {intro && <p className="text-ink-soft leading-relaxed">{intro}</p>}
      </div>
    </section>
  );
}
