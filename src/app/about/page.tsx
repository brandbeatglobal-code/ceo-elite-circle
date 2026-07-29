import { FeatureGrid } from "@/components/FeatureGrid";
import { IconArcs, IconOrbit, IconRings, IconStack } from "@/components/Icons";
import { PhotoHero } from "@/components/PhotoHero";
import { QuoteSection } from "@/components/QuoteSection";
import { Section } from "@/components/Section";
import { PhotoFrame, Placeholder, SectionHeader } from "@/components/ui";
import { photos } from "@/lib/images";
import { ordinal } from "@/lib/ordinal";

/** Structural labels only — the differentiators themselves are still to be written. */
const differences = [
  { icon: <IconRings className="w-full h-full" />, label: "Difference One" },
  { icon: <IconArcs className="w-full h-full" />, label: "Difference Two" },
  { icon: <IconStack className="w-full h-full" />, label: "Difference Three" },
  { icon: <IconOrbit className="w-full h-full" />, label: "Difference Four" },
];

export default function AboutPage() {
  return (
    <>
      <PhotoHero
        eyebrow="The Circle"
        title="About the Circle"
        photo={photos.aboutHero}
        left={<Placeholder tone="ramp" />}
        right={<Placeholder tone="ramp" lead />}
      />

      {/* One — Our Story: headline over a wide photograph */}
      <section className="bg-cream text-ink">
        <div className="wrap">
          <SectionHeader index={ordinal(0)} eyebrow="Story" />

          <div className="grid grid-cols-1 lg:grid-cols-4">
            <h2 className="type-h2 lg:col-span-2 py-12 lg:py-16 lg:pr-10">
              Our Story
            </h2>
          </div>

          <PhotoFrame
            photo={photos.aboutStory}
            className="h-72 sm:h-96 lg:h-[34rem]"
            sizes="100vw"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 pt-10 pb-16 lg:pb-24">
            <div className="hidden lg:block lg:col-span-2" />
            <div className="lg:border-l border-hair lg:pl-8">
              <Placeholder lead />
            </div>
            <div className="lg:border-l border-hair lg:pl-8 mt-8 lg:mt-0">
              <Placeholder />
            </div>
          </div>
        </div>
      </section>

      <Section index={ordinal(1)} title="Our Purpose" />
      <Section index={ordinal(2)} title="Our Beliefs" />
      <Section index={ordinal(3)} title="Our Mission" />
      <Section index={ordinal(4)} title="Our Vision" />

      {/* Six — Leadership Philosophy: pull-quote over a photograph */}
      <QuoteSection
        index={ordinal(5)}
        eyebrow="Philosophy"
        title="Leadership Philosophy"
        photo={photos.aboutPhilosophy}
        quote={
          <Placeholder
            tone="ramp"
            lead
            note="Pull-quote placeholder — this slot must carry real words from a real, named person. Nothing should be written on their behalf."
          />
        }
        support={<Placeholder tone="ramp" />}
      />

      <Section index={ordinal(6)} title="Who We Serve" />

      {/* Eight — What Makes Us Different: icon grid */}
      <FeatureGrid
        index={ordinal(7)}
        eyebrow="Difference"
        title="What Makes Us Different"
        intro={<Placeholder tone="black" lead />}
        features={differences.map((d) => ({
          ...d,
          body: <Placeholder tone="black" />,
        }))}
      />
    </>
  );
}
