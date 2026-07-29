import { Accordion } from "@/components/Accordion";
import { PageHero } from "@/components/PageHero";
import { RequestSection } from "@/components/RequestSection";
import { BulletLabel, Placeholder, SectionHeader } from "@/components/ui";
import { ordinal } from "@/lib/ordinal";

export const metadata = { title: "Trust Framework — CEO Elite Circle" };

/**
 * NO SAMPLE COPY ON THIS PAGE.
 *
 * The ten areas below are commitments a prospective member could reasonably
 * rely on. Draft wording would read as binding whether or not it is finished,
 * so each area carries a labelled placeholder and nothing else. The visual
 * treatment — numbering, the accordion, the two columns — is what stops the
 * page being flat. Do not fill these in without sign-off.
 */
const areas = [
  "Our Commitment",
  "CEO Charter",
  "Moderation Standards",
  "Confidentiality",
  "Governance",
  "Member Conduct",
  "Privacy",
  "Conflict Resolution",
  "Membership Review",
  "Removal Policy",
];

const pad = (i: number) => String(i + 1).padStart(2, "0");

function AreaColumn({ from, to }: { from: number; to: number }) {
  return (
    <Accordion
      initial={-1}
      items={areas.slice(from, to).map((name, i) => ({
        title: (
          <span className="flex items-baseline gap-4">
            <span className="text-olive tabular-nums">{pad(from + i)}</span>
            <span>{name}</span>
          </span>
        ),
        body: (
          <Placeholder note="Policy text pending sign-off. This section states a commitment members may rely on, so nothing is drafted here in the meantime." />
        ),
      }))}
    />
  );
}

export default function TrustPage() {
  return (
    <>
      <PageHero
        eyebrow="Governance"
        title="Trust Framework"
        intro="The Trust Framework is being finalised. The ten areas it will cover are listed below; the wording of each is with the Circle for sign-off and is not published until it is settled."
      />

      {/* Why the page reads as it does — meta, not policy. */}
      <section className="bg-black text-white">
        <div className="wrap">
          <SectionHeader index={ordinal(0)} eyebrow="Status" tone="black" />
          <div className="grid grid-cols-1 lg:grid-cols-4 py-12 lg:py-20">
            <h2
              className="type-h2 lg:col-span-2 lg:pr-10 mb-8 lg:mb-0"
              data-reveal
            >
              Written once, not drafted twice
            </h2>
            <div
              className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 flex flex-col gap-6 items-start"
              data-reveal
              style={{ transitionDelay: "90ms" }}
            >
              <p className="type-lead text-white max-w-lg">
                Everything on this page is a commitment rather than a
                description.
              </p>
              <p className="type-body text-white/70 max-w-lg">
                Confidentiality, conduct, review and removal are the terms a
                member is asked to rely on. Placeholder wording in those places
                would read as settled policy long before it is, so the areas
                below are named and left empty until each one has been agreed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The ten areas — numbered, in two columns */}
      <section className="bg-cream text-ink">
        <div className="wrap">
          <SectionHeader index={ordinal(1)} eyebrow="Policy areas" />

          <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair">
            <h2
              className="type-h2 lg:col-span-2 py-12 lg:py-16 lg:pr-10"
              data-reveal
            >
              The ten areas
            </h2>
            <div
              className="lg:col-span-2 lg:border-l border-hair lg:pl-8 pb-12 lg:py-16 flex flex-col gap-4 items-start"
              data-reveal
              style={{ transitionDelay: "80ms" }}
            >
              <BulletLabel className="text-olive">Awaiting sign-off</BulletLabel>
              <p className="type-body text-olive max-w-md">
                Open any area to see its current state. Each will carry its full
                wording once agreed.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 py-10">
            <div data-reveal>
              <AreaColumn from={0} to={5} />
            </div>
            <div data-reveal style={{ transitionDelay: "90ms" }}>
              <AreaColumn from={5} to={10} />
            </div>
          </div>
        </div>
      </section>

      <RequestSection index={ordinal(2)} />
    </>
  );
}
