import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import {
  ArrowLink,
  BulletLabel,
  PhotoFrame,
  PillButton,
  Placeholder,
  SectionHeader,
} from "@/components/ui";
import { photos } from "@/lib/images";
import { ordinal } from "@/lib/ordinal";

const tiers = [
  { name: "Executive Circle", photo: photos.tierExecutive },
  { name: "Elite Circle", photo: photos.tierElite },
  { name: "Chairman's Circle", photo: photos.tierChairman },
];

const tail = [
  "Membership Benefits",
  "Membership Journey",
  "Frequently Asked Questions",
];

export default function MembershipPage() {
  return (
    <>
      <PageHero eyebrow="Membership" title="Membership" />

      <Section index={ordinal(0)} title="Who Should Join" />

      {/* Membership categories — horizontal rows, one per category */}
      <section className="bg-cream text-ink">
        <div className="wrap">
          <SectionHeader index={ordinal(1)} eyebrow="Membership Categories" />

          <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair">
            <h2 className="type-h2 lg:col-span-2 py-12 lg:py-16 lg:pr-10">
              Membership Categories
            </h2>
            <div className="lg:col-span-2 lg:border-l border-hair lg:pl-8 pb-12 lg:py-16">
              <Placeholder lead />
            </div>
          </div>

          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair"
            >
              <div className="flex flex-col justify-between py-8 lg:py-10 lg:pr-8 gap-8">
                <BulletLabel className="text-olive">Category</BulletLabel>
                <ArrowLink href="/contact">
                  Request Membership Consideration
                </ArrowLink>
              </div>

              <div className="lg:col-span-2 lg:border-l border-hair lg:pl-8 py-8 lg:py-10 flex flex-col justify-between gap-8">
                <Placeholder lead />
                <h3 className="type-body text-ink">{tier.name}</h3>
              </div>

              <div className="lg:border-l border-hair lg:pl-8 py-8 lg:py-10">
                <PhotoFrame
                  photo={tier.photo}
                  greyscale
                  className="h-52 lg:h-44"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {tail.map((title, i) => (
        <Section key={title} index={ordinal(i + 2)} title={title} />
      ))}

      <section className="bg-ramp-low text-white">
        <div className="wrap py-24 lg:py-32 flex flex-col items-center gap-10">
          <h2 className="type-h2 text-center max-w-3xl">
            Request Membership Consideration
          </h2>
          <PillButton href="/contact" variant="light" className="w-full max-w-2xl">
            Begin Your Membership Journey
          </PillButton>
        </div>
      </section>
    </>
  );
}
