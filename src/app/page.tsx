import Link from "next/link";
import { Section, Placeholder } from "@/components/Section";

const pillars = [
  "Strategic Advisory",
  "Elite Network",
  "Executive Forums",
  "Knowledge & Insights",
  "Executive Councils",
];

const experiences = [
  "CEO Leadership Summit",
  "Chairman's Majlis",
  "Executive Leadership Retreat",
  "Future Leadership Forum",
  "CEO Excellence Awards",
  "International CEO Delegation",
  "CEO Private Dinners",
];

const tiers = ["Executive Circle", "Elite Circle", "Chairman's Circle"];

export default function Home() {
  return (
    <>
      {/* Hero Banner — copy as specified in the brief, verbatim */}
      <section className="bg-white">
        <div className="wrap py-28 md:py-40 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-gold mb-6">
            CEO Elite Circle
          </p>
          <h1 className="text-4xl md:text-6xl text-forest leading-tight mb-8">
            A Private Circle for Distinguished Business Leaders.
          </h1>
          <div className="divider-gold mb-8" />
          <p className="text-lg text-ink-soft mb-4">
            Leadership was never meant to be experienced alone.
          </p>
          <p className="text-lg text-ink-soft mb-10 leading-relaxed">
            Built on trust, guided by integrity, and united by a shared
            commitment to excellence, the CEO Elite Circle brings together
            accomplished business leaders in a confidential environment where
            meaningful relationships, thoughtful dialogue, and strategic
            collaboration shape the future of leadership.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-forest text-white text-sm px-8 py-4 hover:bg-forest-dark transition-colors"
          >
            Request Membership Consideration
          </Link>
        </div>
      </section>

      <Section eyebrow="Our Philosophy" title="Our Philosophy" tone="stone" />
      <Section eyebrow="Why the Circle" title="Why the Circle Exists" />
      <Section eyebrow="Timing" title="Why Now" tone="stone" />

      {/* The Five Pillars — teaser */}
      <section className="bg-white">
        <div className="wrap py-20 md:py-28">
          <p className="text-xs uppercase tracking-[0.2em] text-gold mb-4">
            Structure
          </p>
          <h2 className="text-3xl md:text-5xl text-forest mb-6 max-w-2xl">
            The Five Pillars
          </h2>
          <div className="divider-gold mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {pillars.map((p) => (
              <div key={p} className="border-t border-gold pt-4">
                <p className="text-ink text-sm">{p}</p>
              </div>
            ))}
          </div>
          <Link
            href="/pillars"
            className="inline-block mt-10 text-sm text-forest border-b border-forest hover:text-gold hover:border-gold transition-colors"
          >
            Discover the Circle
          </Link>
        </div>
      </section>

      {/* Signature Experiences — teaser */}
      <section className="bg-stone">
        <div className="wrap py-20 md:py-28">
          <p className="text-xs uppercase tracking-[0.2em] text-gold mb-4">
            Signature Experiences
          </p>
          <h2 className="text-3xl md:text-5xl text-forest mb-6 max-w-2xl">
            Signature Experiences
          </h2>
          <div className="divider-gold mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
            {experiences.map((e) => (
              <p key={e} className="text-ink-soft border-b border-white/60 pb-3">
                {e}
              </p>
            ))}
          </div>
          <Link
            href="/experiences"
            className="inline-block mt-10 text-sm text-forest border-b border-forest hover:text-gold hover:border-gold transition-colors"
          >
            Discover the Circle
          </Link>
        </div>
      </section>

      {/* Membership Categories — teaser */}
      <section className="bg-white">
        <div className="wrap py-20 md:py-28">
          <p className="text-xs uppercase tracking-[0.2em] text-gold mb-4">
            Membership
          </p>
          <h2 className="text-3xl md:text-5xl text-forest mb-6 max-w-2xl">
            Membership Categories
          </h2>
          <div className="divider-gold mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((t) => (
              <div key={t} className="border border-stone p-8">
                <h3 className="text-2xl text-forest mb-3">{t}</h3>
                <Placeholder />
              </div>
            ))}
          </div>
          <Link
            href="/membership"
            className="inline-block mt-10 text-sm text-forest border-b border-forest hover:text-gold hover:border-gold transition-colors"
          >
            Discover the Circle
          </Link>
        </div>
      </section>

      <Section
        eyebrow="Governance"
        title="Trust Framework"
        tone="stone"
      >
        <Placeholder />
        <Link
          href="/trust"
          className="inline-block mt-6 text-sm text-forest border-b border-forest hover:text-gold hover:border-gold transition-colors"
        >
          Discover the Circle
        </Link>
      </Section>

      <Section eyebrow="Selection" title="Membership Selection" />

      {/* Testimonials — placeholder */}
      <section className="bg-stone">
        <div className="wrap py-20 md:py-28">
          <p className="text-xs uppercase tracking-[0.2em] text-gold mb-4">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-5xl text-forest mb-10 max-w-2xl">
            What Members Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 border border-stone">
                <Placeholder />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply for Membership — closing CTA */}
      <section className="bg-forest">
        <div className="wrap py-24 text-center">
          <h2 className="text-3xl md:text-5xl text-white mb-6">
            Request Membership Consideration
          </h2>
          <div className="divider-gold mx-auto mb-8" />
          <p className="text-white/80 max-w-xl mx-auto mb-10">
            Membership in the CEO Elite Circle is by invitation and
            consideration only.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gold text-forest text-sm px-8 py-4 hover:bg-gold-soft transition-colors"
          >
            Begin Your Membership Journey
          </Link>
        </div>
      </section>
    </>
  );
}
