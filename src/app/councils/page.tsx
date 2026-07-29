import { FeatureGrid } from "@/components/FeatureGrid";
import { IconArcs, IconOrbit, IconRings, IconStack } from "@/components/Icons";
import { NumberedSteps } from "@/components/NumberedSteps";
import { PageHero } from "@/components/PageHero";
import { RequestSection } from "@/components/RequestSection";
import { Section } from "@/components/Section";
import { VariantCards } from "@/components/VariantCards";
import { Placeholder } from "@/components/ui";
import { ordinal } from "@/lib/ordinal";

export const metadata = { title: "Executive Councils — CEO Elite Circle" };

/* SAMPLE COPY, except Expert Advisors, which names real people and so stays a
   placeholder. */

const councils = [
  {
    name: "Sector Councils",
    body: "Organised by industry, for questions that only make sense with shared commercial context. Members arrive already fluent in the same landscape.",
  },
  {
    name: "Regional Councils",
    body: "Organised by geography, where the operating environment is the common ground and regulation is a shared concern rather than a footnote.",
  },
  {
    name: "Practice Councils",
    body: "Organised by function, drawing members who hold a comparable remit across different industries.",
  },
];

const format = [
  {
    title: "Convene",
    body: "Each council opens with the questions its members are carrying, gathered before the session rather than raised in it.",
  },
  {
    title: "Work the question",
    body: "One subject is taken at a time and worked properly. Councils would rather finish one question than open four.",
  },
  {
    title: "Record the position",
    body: "What the council concludes is written down for its own members, so the next session starts from it.",
  },
  {
    title: "Carry it between sessions",
    body: "Work continues in the interval. The council is a standing group, not a series of unrelated meetings.",
  },
];

const benefits = [
  {
    icon: <IconRings className="w-full h-full" />,
    label: "Continuity",
    body: "The same people, across a year. Context accumulates instead of resetting at each gathering.",
  },
  {
    icon: <IconArcs className="w-full h-full" />,
    label: "Depth",
    body: "One question at a time, taken further than a single meeting would allow.",
  },
  {
    icon: <IconStack className="w-full h-full" />,
    label: "Record",
    body: "Positions are written down and held for the council's own members.",
  },
  {
    icon: <IconOrbit className="w-full h-full" />,
    label: "Reach",
    body: "Councils extend a member's context beyond their own market and function.",
  },
];

const calendar = [
  {
    title: "Opening session",
    body: "The council sets its agenda for the year and agrees what it intends to resolve.",
  },
  {
    title: "Working sessions",
    body: "The substance of the year. Each session takes one question and closes it as far as it can be closed.",
  },
  {
    title: "Between sessions",
    body: "Members circulate material and carry the work forward, so nothing restarts from the beginning.",
  },
  {
    title: "Closing session",
    body: "The council reviews what it concluded, and hands forward what it did not.",
  },
];

export default function CouncilsPage() {
  return (
    <>
      <PageHero
        eyebrow="Executive Councils"
        title="Executive Councils"
        intro="Standing groups that hold their membership across the year, so that the work compounds rather than beginning again at each meeting."
      />

      <Section index={ordinal(0)} eyebrow="Purpose" title="Purpose">
        <p className="type-lead text-ink">
          A council exists to think properly about one field, over a long enough
          period that the thinking gets somewhere.
        </p>
        <p className="type-body text-olive">
          Where a forum convenes around a single question and closes, a council
          holds its membership across the year. Each session begins where the
          last ended. The result is less immediate than a forum and considerably
          more durable.
        </p>
      </Section>

      <VariantCards
        index={ordinal(1)}
        eyebrow="Councils"
        title="The Councils"
        intro="Councils form around whatever the members have genuinely in common — an industry, a region, or a remit."
        variants={councils}
        tone="black"
      />

      <NumberedSteps
        index={ordinal(2)}
        eyebrow="Meeting format"
        title="Meeting Format"
        intro="Every council runs to the same shape, whatever it is organised around."
        steps={format}
        tone="cream"
      />

      <FeatureGrid
        index={ordinal(3)}
        eyebrow="Benefits"
        title="Benefits"
        intro={
          <p className="type-lead text-white max-w-lg">
            What a standing group offers that a one-off gathering cannot.
          </p>
        }
        features={benefits}
      />

      <NumberedSteps
        index={ordinal(4)}
        eyebrow="Annual calendar"
        title="Annual Calendar"
        intro="The shape of a council year. Specific dates are set with each council and are not published here."
        steps={calendar}
        tone="cream"
      />

      <Section
        index={ordinal(5)}
        eyebrow="Expert advisors"
        title="Expert Advisors"
      >
        <Placeholder
          note="Advisors are named individuals — this section stays a placeholder until there are real people, with their agreement, to name."
        />
      </Section>

      <RequestSection index={ordinal(6)} />
    </>
  );
}
