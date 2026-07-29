import { notFound } from "next/navigation";
import { Accordion } from "@/components/Accordion";
import { AttributedQuote } from "@/components/AttributedQuote";
import { CvTimeline } from "@/components/CvTimeline";
import { FeatureGrid } from "@/components/FeatureGrid";
import { IconArcs, IconOrbit, IconRings, IconStack } from "@/components/Icons";
import { RequestSection } from "@/components/RequestSection";
import { SplitHero } from "@/components/SplitHero";
import {
  BulletLabel,
  Placeholder,
  SectionHeader,
} from "@/components/ui";
import { leadership, memberBySlug } from "@/lib/leadership";
import { ordinal } from "@/lib/ordinal";

export function generateStaticParams() {
  return leadership.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = memberBySlug(slug);
  return {
    title: member?.name
      ? `${member.name} — CEO Elite Circle`
      : "Leadership — CEO Elite Circle",
  };
}

const recognitionIcons = [IconRings, IconArcs, IconStack, IconOrbit];

export default async function LeadershipMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = memberBySlug(slug);
  if (!member) notFound();

  let n = 0;
  const next = () => ordinal(n++);

  // Every slot falls back to the labelled placeholder, so the template is
  // complete and visitable before any real person exists.
  const cvRows =
    member.timeline.length > 0
      ? member.timeline.map((row) => ({
          period: (
            <BulletLabel className="text-white/60">{row.period}</BulletLabel>
          ),
          title: (
            <p className="type-display text-xl md:text-2xl text-white max-w-sm">
              {row.title}
            </p>
          ),
        }))
      : Array.from({ length: 5 }, () => ({
          period: <BulletLabel className="text-white/60">Period</BulletLabel>,
          title: <Placeholder tone="black" lead />,
        }));

  const expertiseItems =
    member.expertise.length > 0
      ? member.expertise.map((e) => ({
          title: e.title,
          body: <p className="type-body text-olive">{e.body}</p>,
        }))
      : Array.from({ length: 5 }, (_, i) => ({
          title: `Area ${ordinal(i)}`,
          body: <Placeholder />,
        }));

  return (
    <>
      <SplitHero
        eyebrow="Leadership"
        credentials={
          member.credentials ? (
            <p className="type-label text-white/75">{member.credentials}</p>
          ) : (
            <Placeholder tone="ramp" />
          )
        }
        title={
          member.name ?? (
            <span className="type-body font-normal">
              <Placeholder tone="ramp" />
            </span>
          )
        }
        role={
          member.role ? (
            <p className="type-body text-white/75">{member.role}</p>
          ) : null
        }
        intro={
          member.intro ? (
            <p className="type-body text-white/75">{member.intro}</p>
          ) : (
            <Placeholder tone="ramp" />
          )
        }
        photo={member.photo}
      />

      {/* Areas of expertise — accordion */}
      <section className="bg-cream text-ink">
        <div className="wrap">
          <SectionHeader index={next()} eyebrow="Expertise" />
          <div className="grid grid-cols-1 lg:grid-cols-4 py-12 lg:py-24 gap-10">
            <div className="lg:col-span-2 lg:pr-10">
              <h2 className="type-h2 mb-8">Areas of expertise</h2>
              <Placeholder lead />
            </div>
            <div className="lg:col-span-2 lg:border-l border-hair lg:pl-8">
              <Accordion items={expertiseItems} />
            </div>
          </div>
        </div>
      </section>

      {/* Education and career — alternating CV timeline */}
      <section className="bg-black text-white">
        <div className="wrap">
          <SectionHeader index={next()} eyebrow="Education & Career" tone="black" />
          <div className="pt-12 lg:pt-16">
            <h2 className="type-h2 lg:[text-indent:26%] max-w-6xl mb-6">
              Education and career
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 mb-8">
              <div className="hidden lg:block" />
              <div className="lg:border-l border-hair-dark lg:pl-8">
                <Placeholder tone="black" />
              </div>
            </div>
            <CvTimeline rows={cvRows} />
          </div>
          <div className="pb-16" />
        </div>
      </section>

      {/* Recognition — house icon grid */}
      <FeatureGrid
        index={next()}
        eyebrow="Recognition"
        title="Recognition"
        intro={<Placeholder tone="black" lead />}
        features={recognitionIcons.map((Icon, i) => ({
          icon: <Icon className="w-full h-full" />,
          label: `Recognition ${ordinal(i)}`,
          body: <Placeholder tone="black" />,
        }))}
      />

      {/* Philosophy — attributed pull-quote */}
      <AttributedQuote
        index={next()}
        eyebrow="Philosophy"
        quote={
          member.quote ? (
            <blockquote className="type-h2">
              &ldquo;{member.quote.words}&rdquo;
            </blockquote>
          ) : (
            <Placeholder
              tone="black"
              lead
              note="Pull-quote placeholder — this slot must carry real words from a real, named person. Nothing should be written on their behalf."
            />
          )
        }
        portrait={member.photo}
        attribution={
          member.quote ? (
            <p className="type-body text-white">{member.quote.attribution}</p>
          ) : (
            <Placeholder tone="black" />
          )
        }
        support={<Placeholder tone="black" />}
      />

      <RequestSection index={next()} variant="enquiry" />
    </>
  );
}
