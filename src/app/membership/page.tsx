import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Section, Placeholder } from "@/components/Section";

export default function MembershipPage() {
  return (
    <>
      <PageHero eyebrow="Membership" title="Membership" />
      <Section title="Who Should Join" tone="stone" />

      <section className="bg-white">
        <div className="wrap py-20 md:py-28">
          <h2 className="text-3xl md:text-5xl text-forest mb-10">
            Membership Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Executive Circle", "Elite Circle", "Chairman's Circle"].map(
              (t) => (
                <div key={t} className="border border-stone p-8">
                  <h3 className="text-2xl text-forest mb-3">{t}</h3>
                  <Placeholder />
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <Section title="Membership Benefits" tone="stone" />
      <Section title="Membership Journey" />
      <Section title="Frequently Asked Questions" tone="stone" />

      <section className="bg-forest">
        <div className="wrap py-20 text-center">
          <h2 className="text-3xl md:text-5xl text-white mb-8">
            Request Membership Consideration
          </h2>
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
