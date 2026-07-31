import { Accordion } from "@/components/Accordion";
import { PageHero } from "@/components/PageHero";
import { RequestSection } from "@/components/RequestSection";
import { BulletLabel, SectionHeader } from "@/components/ui";
import { ordinal } from "@/lib/ordinal";
import { trust } from "@/lib/trust";

export const metadata = { title: trust.metaTitle };

/**
 * SIGNED-OFF POLICY TEXT ON THIS PAGE — the only page of the site that carries
 * any.
 *
 * The ten areas are commitments a member is held to and can hold the Circle
 * to. They were empty for most of this project because draft wording reads as
 * binding whether or not it is finished; they are filled now because the
 * founder signed them off. The rule that replaces "do not draft these" is "do
 * not edit these" — not for rhythm, not for length, not to match the voice of
 * the rest of the site. See `src/lib/trust.ts`.
 *
 * Everything outside the accordion — the hero, the Status section, the labels
 * — is ordinary descriptive copy about the framework, and is not a commitment.
 * Keep the two straight.
 */
const { hero, status, areas } = trust;

const pad = (i: number) => String(i + 1).padStart(2, "0");

function AreaColumn({ from, to }: { from: number; to: number }) {
  return (
    <Accordion
      initial={-1}
      items={areas.items.slice(from, to).map((area, i) => ({
        title: (
          <span className="flex items-baseline gap-4">
            <span className="text-olive tabular-nums">{pad(from + i)}</span>
            <span>{area.name}</span>
          </span>
        ),
        body: <p className="type-body text-olive max-w-xl">{area.body}</p>,
      }))}
    />
  );
}

export default function TrustPage() {
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        intro={hero.intro}
      />

      {/* What the framework is and where it stands — meta, not policy. */}
      <section className="bg-black text-white">
        <div className="wrap">
          <SectionHeader index={ordinal(0)} eyebrow={status.eyebrow} tone="black" />
          <div className="grid grid-cols-1 lg:grid-cols-4 py-12 lg:py-28">
            <h2
              className="type-h2 lg:col-span-2 lg:pr-10 mb-8 lg:mb-0"
              data-reveal
            >
              {status.title}
            </h2>
            <div
              className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 flex flex-col gap-6 items-start"
              data-reveal
              style={{ transitionDelay: "90ms" }}
            >
              <p className="type-lead text-white max-w-lg">{status.lead}</p>
              <p className="type-body text-white/70 max-w-lg">{status.body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* The ten areas — numbered, in two columns */}
      <section className="bg-cream text-ink">
        <div className="wrap">
          <SectionHeader index={ordinal(1)} eyebrow={areas.eyebrow} />

          <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair">
            <h2
              className="type-h2 lg:col-span-2 py-12 lg:py-24 lg:pr-10"
              data-reveal
            >
              {areas.title}
            </h2>
            <div
              className="lg:col-span-2 lg:border-l border-hair lg:pl-8 pb-12 lg:py-24 flex flex-col gap-4 items-start"
              data-reveal
              style={{ transitionDelay: "80ms" }}
            >
              <BulletLabel className="text-olive">{areas.label}</BulletLabel>
              <p className="type-body text-olive max-w-md">{areas.body}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 py-14">
            <div data-reveal>
              <AreaColumn from={0} to={5} />
            </div>
            <div data-reveal style={{ transitionDelay: "90ms" }}>
              <AreaColumn from={5} to={10} />
            </div>
          </div>
        </div>
      </section>

      <RequestSection index={ordinal(2)} variant="governance" />
    </>
  );
}
