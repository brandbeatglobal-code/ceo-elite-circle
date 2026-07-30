import { Accordion } from "@/components/Accordion";
import { PageHero } from "@/components/PageHero";
import { RequestSection } from "@/components/RequestSection";
import { BulletLabel, Placeholder, SectionHeader } from "@/components/ui";
import { ordinal } from "@/lib/ordinal";
import { trust } from "@/lib/trust";

export const metadata = { title: trust.metaTitle };

/**
 * NO SAMPLE COPY ON THIS PAGE.
 *
 * The ten areas in `content/trust.json` are commitments a prospective member
 * could reasonably rely on. Draft wording would read as binding whether or not
 * it is finished, so each area carries a labelled placeholder and nothing else
 * — the content file holds names, and has no field for policy text at all. The
 * visual treatment — numbering, the accordion, the two columns — is what stops
 * the page being flat. Do not fill these in without sign-off.
 */
const { hero, status, areas } = trust;

const pad = (i: number) => String(i + 1).padStart(2, "0");

function AreaColumn({ from, to }: { from: number; to: number }) {
  return (
    <Accordion
      initial={-1}
      items={areas.items.slice(from, to).map((name, i) => ({
        title: (
          <span className="flex items-baseline gap-4">
            <span className="text-olive tabular-nums">{pad(from + i)}</span>
            <span>{name}</span>
          </span>
        ),
        body: <Placeholder note={areas.placeholderNote} />,
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

      {/* Why the page reads as it does — meta, not policy. */}
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
