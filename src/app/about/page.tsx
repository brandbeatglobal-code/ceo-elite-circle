import { FeatureGrid } from "@/components/FeatureGrid";
import { IconArcs, IconOrbit, IconRings, IconStack } from "@/components/Icons";
import { PhotoHero } from "@/components/PhotoHero";
import { ProfileGrid } from "@/components/ProfileGrid";
import { QuoteSection } from "@/components/QuoteSection";
import { RequestSection } from "@/components/RequestSection";
import { Section } from "@/components/Section";
import { PhotoFrame, Placeholder, SectionHeader } from "@/components/ui";
import { photos } from "@/lib/images";
import { ordinal } from "@/lib/ordinal";

/* SAMPLE COPY. The Leadership cards and the philosophy pull-quote stay empty
   deliberately — both would require inventing a named person. */

const leadership = [
  photos.leadershipOne,
  photos.leadershipTwo,
  photos.leadershipThree,
  photos.leadershipFour,
];

const differences = [
  {
    icon: <IconRings className="w-full h-full" />,
    label: "Closed by design",
    body: "The Circle does not grow towards a target. Membership is bounded by what a room can hold, and admission is slowed rather than accelerated.",
  },
  {
    icon: <IconArcs className="w-full h-full" />,
    label: "Counsel, not content",
    body: "There is no keynote and no stage. Members come to be questioned by peers rather than addressed by speakers.",
  },
  {
    icon: <IconStack className="w-full h-full" />,
    label: "Confidence as the first term",
    body: "Discretion is not a policy applied to the Circle. It is the condition that makes the Circle possible at all.",
  },
  {
    icon: <IconOrbit className="w-full h-full" />,
    label: "Built to compound",
    body: "Councils and forums hold their membership across the year, so context accumulates instead of resetting at every meeting.",
  },
];

const sections = [
  {
    title: "Our Purpose",
    lead: "To hold a room in which leadership can be discussed honestly.",
    body: "The Circle exists to make candour ordinary between people who rarely encounter it. Everything else — the forums, the councils, the briefings — is built to serve that, and is dropped when it stops serving it.",
  },
  {
    title: "Our Beliefs",
    lead: "Four convictions shape how the Circle works.",
    body: "That counsel is worth more than advice. That a small room outperforms a large one. That confidence, once given, is absolute. And that a network is measured by the quality of a single introduction rather than the length of a list.",
  },
  {
    title: "Our Mission",
    lead: "To be the room a chief executive keeps returning to.",
    body: "Not the largest gathering in the calendar, nor the most visible — the one that proves useful enough to survive a tightening diary. The Circle would rather be indispensable to a few than familiar to many.",
  },
  {
    title: "Our Vision",
    lead: "A standard for how senior leaders convene.",
    body: "That private, considered, confidential conversation becomes the expectation at this level rather than the exception, and that the Circle is held as the reference for how such rooms are run.",
  },
  {
    title: "Who We Serve",
    lead: "Chief executives and chairs of established organisations.",
    body: "Members carry final responsibility for an organisation of substance — the accountability that cannot be delegated to anyone else in the building. Sector, geography and scale vary widely across the membership. The seniority and the disposition do not.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PhotoHero
        eyebrow="The Circle"
        title="About the Circle"
        photo={photos.aboutHero}
        left={
          <p className="type-body text-white/80 max-w-xs">
            A private circle for chief executives, built on trust rather than
            reach.
          </p>
        }
        right={
          <p className="type-lead text-white max-w-md">
            The Circle was formed on a simple observation: the people who most
            need candid counsel are the least likely to be offered it.
          </p>
        }
      />

      {/* One — Our Story: headline over a wide photograph */}
      <section className="bg-cream text-ink">
        <div className="wrap">
          <SectionHeader index={ordinal(0)} eyebrow="Story" />

          <div className="grid grid-cols-1 lg:grid-cols-4">
            <h2
              className="type-h2 lg:col-span-2 py-12 lg:py-24 lg:pr-10"
              data-reveal
            >
              Our Story
            </h2>
          </div>

          <PhotoFrame
            photo={photos.aboutStory}
            hover
            className="h-72 sm:h-96 lg:h-[34rem]"
            sizes="100vw"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 pt-10 pb-16 lg:pb-24">
            <div className="hidden lg:block lg:col-span-2" />
            <div
              className="lg:border-l border-hair lg:pl-8"
              data-reveal
            >
              <p className="type-lead text-ink max-w-sm">
                The Circle began as a standing invitation between a handful of
                chief executives who had run out of rooms in which they could
                speak plainly.
              </p>
            </div>
            <div
              className="lg:border-l border-hair lg:pl-8 mt-8 lg:mt-0"
              data-reveal
              style={{ transitionDelay: "90ms" }}
            >
              <p className="type-body text-olive max-w-sm">
                What began as an occasional dinner became a structure — pillars,
                councils, a framework of trust — because the value turned out to
                sit in the regularity rather than the occasion. The form has
                changed a good deal since. The premise has not.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Two — Leadership: honest empty structure until there are real people */}
      <ProfileGrid
        index={ordinal(1)}
        eyebrow="Leadership"
        title="Leadership"
        intro={
          <p className="type-lead text-ink max-w-lg">
            The Circle is convened by a small group who hold its governance and
            decide who is invited to join.
          </p>
        }
        photos={leadership}
      />

      {sections.slice(0, 4).map((s, i) => (
        <Section key={s.title} index={ordinal(i + 2)} title={s.title}>
          <p className="type-lead text-ink">{s.lead}</p>
          <p className="type-body text-olive">{s.body}</p>
        </Section>
      ))}

      {/* Seven — Leadership Philosophy: pull-quote over a photograph */}
      <QuoteSection
        index={ordinal(6)}
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
        support={
          <p className="type-body text-white/75 max-w-sm">
            Leadership at this level turns less on having answers than on the
            quality of the questions a person is willing to sit with. The Circle
            is built around that conviction, and everything in it follows from
            there.
          </p>
        }
      />

      <Section index={ordinal(7)} title={sections[4].title}>
        <p className="type-lead text-ink">{sections[4].lead}</p>
        <p className="type-body text-olive">{sections[4].body}</p>
      </Section>

      {/* Nine — What Makes Us Different: icon grid */}
      <FeatureGrid
        index={ordinal(8)}
        eyebrow="Difference"
        title="What Makes Us Different"
        intro={
          <p className="type-lead text-white max-w-lg">
            Four things the Circle does differently, and holds to when it would
            be easier not to.
          </p>
        }
        features={differences}
      />

      <RequestSection index={ordinal(9)} />
    </>
  );
}
