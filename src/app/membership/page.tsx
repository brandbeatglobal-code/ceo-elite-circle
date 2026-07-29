import { Accordion } from "@/components/Accordion";
import { CandidacyChecklist } from "@/components/CandidacyChecklist";
import { FeatureGrid } from "@/components/FeatureGrid";
import { IconArcs, IconOrbit, IconRings, IconStack } from "@/components/Icons";
import { NumberedSteps } from "@/components/NumberedSteps";
import { PageHero } from "@/components/PageHero";
import { RequestSection } from "@/components/RequestSection";
import {
  ArrowLink,
  BulletLabel,
  PhotoFrame,
  SectionHeader,
} from "@/components/ui";
import { photos } from "@/lib/images";
import { membershipCategoriesIntro, tiers as tierCopy } from "@/lib/copy";
import { ordinal } from "@/lib/ordinal";

export const metadata = { title: "Membership — CEO Elite Circle" };

/* SAMPLE COPY throughout. Category descriptions say what each category
   involves; they state no fee and no entitlement that reads as a term. */

const tiers = [
  { ...tierCopy[0], photo: photos.tierExecutive },
  { ...tierCopy[1], photo: photos.tierElite },
  { ...tierCopy[2], photo: photos.tierChairman },
];

const criteria = [
  {
    title: "Leading an established organisation",
    body: "Membership is held by those carrying final responsibility, rather than by those advising on it.",
  },
  {
    title: "Long past needing an audience",
    body: "The Circle suits leaders who have nothing left to prove in public and a great deal still to work out in private.",
  },
  {
    title: "Prepared to contribute",
    body: "Members are expected to give counsel as readily as they take it. A quiet year is fine; a passive one is not.",
  },
  {
    title: "Discreet by disposition",
    body: "Everything within the Circle depends on confidence being kept without being asked for.",
  },
];

const benefits = [
  {
    icon: <IconRings className="w-full h-full" />,
    label: "Counsel",
    body: "Access to peers who have faced comparable decisions, in settings built for candour rather than display.",
  },
  {
    icon: <IconArcs className="w-full h-full" />,
    label: "Introductions",
    body: "Considered introductions made by the Circle, in both directions, and only where both parties stand to gain.",
  },
  {
    icon: <IconStack className="w-full h-full" />,
    label: "Standing",
    body: "A place within a membership that is closed, and whose value rests on remaining so.",
  },
  {
    icon: <IconOrbit className="w-full h-full" />,
    label: "Reach",
    body: "Councils and delegations that extend a member's context beyond their own market.",
  },
];

const journey = [
  {
    title: "Introduction",
    body: "Most members arrive through another member. Where they do not, the first conversation establishes whether the Circle is the right room.",
  },
  {
    title: "Conversation",
    body: "An unhurried discussion about what you are working on and what you would want from the membership.",
  },
  {
    title: "Consideration",
    body: "Your candidacy is considered within the Circle. The question is fit rather than qualification.",
  },
  {
    title: "Invitation",
    body: "Where consideration is favourable, an invitation follows, along with the terms of membership.",
  },
];

const faq = [
  {
    title: "Can I apply directly?",
    body: "Yes. Most members are introduced by an existing member, but a direct request is considered on the same footing.",
  },
  {
    title: "What is expected of a member?",
    body: "Presence and candour more than time. Members are asked to attend what they commit to, and to give counsel as readily as they take it.",
  },
  {
    title: "Is the membership list published?",
    body: "Confidentiality terms — including how members are identified — are set out in the Trust Framework, which is being finalised. We would rather point you there than summarise it here.",
  },
  {
    title: "How long does consideration take?",
    body: "It varies with the enquiry. The Circle would rather take the time to get the fit right than move to a schedule.",
  },
  {
    title: "Can membership be held by a company?",
    body: "No. Membership is personal to the individual and does not transfer with a role.",
  },
];

export default function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Membership"
        intro="Membership is personal, closed, and held by invitation and consideration. What follows sets out who it suits and how it is entered."
      />

      <CandidacyChecklist
        index={ordinal(0)}
        eyebrow="Who should join"
        title="Who should join"
        intro="The Circle is deliberately narrow. It suits a particular kind of leader more than a particular kind of company."
        criteria={criteria}
      />

      {/* Membership categories — horizontal rows, one per category */}
      <section className="bg-black text-white">
        <div className="wrap">
          <SectionHeader index={ordinal(1)} eyebrow="Categories" tone="black" />

          <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair-dark">
            <h2
              className="type-h2 lg:col-span-2 py-16 lg:py-24 lg:pr-10"
              data-reveal
            >
              Membership Categories
            </h2>
            <div
              className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 pb-16 lg:py-24"
              data-reveal
              style={{ transitionDelay: "80ms" }}
            >
              <p className="type-lead text-white max-w-lg">
                {membershipCategoriesIntro}
              </p>
            </div>
          </div>

          {tiers.map((tier, i) => (
            <div
              key={tier.name}
              className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair-dark"
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className="flex flex-col justify-between py-16 lg:py-14 lg:pr-8 gap-8">
                <BulletLabel className="text-white/60">Category</BulletLabel>
                <ArrowLink href="/contact" tone="black">
                  Request Membership Consideration
                </ArrowLink>
              </div>

              <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 py-16 lg:py-14 flex flex-col justify-between gap-8">
                <p className="type-lead text-white max-w-md">{tier.body}</p>
                <h3 className="type-display text-2xl md:text-3xl text-white">
                  {tier.name}
                </h3>
              </div>

              <div className="lg:border-l border-hair-dark lg:pl-8 py-16 lg:py-14">
                <PhotoFrame
                  photo={tier.photo}
                  tone="black"
                  greyscale
                  hover
                  className="h-52 lg:h-44"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <FeatureGrid
        index={ordinal(2)}
        eyebrow="Benefits"
        title="Membership Benefits"
        intro={
          <p className="type-lead text-white max-w-lg">
            What membership provides, stated plainly. Nothing here depends on
            volume — the Circle is built to be small.
          </p>
        }
        features={benefits}
      />

      <NumberedSteps
        index={ordinal(3)}
        eyebrow="Journey"
        title="Membership Journey"
        intro="From first conversation to invitation. The sequence is short, and deliberately unhurried."
        steps={journey}
        tone="cream"
      />

      {/* FAQ — accordion */}
      <section className="bg-cream text-ink">
        <div className="wrap">
          <SectionHeader index={ordinal(4)} eyebrow="Questions" />
          <div className="grid grid-cols-1 lg:grid-cols-4 py-16 lg:py-24 gap-10">
            <div className="lg:col-span-2 lg:pr-10" data-reveal>
              <h2 className="type-h2 mb-8">Frequently Asked Questions</h2>
              <p className="type-lead max-w-md">
                The questions we are asked most often, answered as directly as
                we can before a conversation begins.
              </p>
            </div>
            <div
              className="lg:col-span-2 lg:border-l border-hair lg:pl-8"
              data-reveal
              style={{ transitionDelay: "90ms" }}
            >
              <Accordion
                items={faq.map((f) => ({
                  title: f.title,
                  body: <p className="type-body text-olive">{f.body}</p>,
                }))}
              />
            </div>
          </div>
        </div>
      </section>

      <RequestSection index={ordinal(5)} />
    </>
  );
}
