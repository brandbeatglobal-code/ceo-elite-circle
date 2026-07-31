import { FeatureGrid } from "@/components/FeatureGrid";
import { Icon } from "@/components/Icons";
import { PhotoHero } from "@/components/PhotoHero";
import { ProfileGrid } from "@/components/ProfileGrid";
import { QuoteSection } from "@/components/QuoteSection";
import { RequestSection } from "@/components/RequestSection";
import { Section } from "@/components/Section";
import {
  BulletLabel,
  PhotoFrame,
  Placeholder,
  SectionHeader,
} from "@/components/ui";
import { about } from "@/lib/about";
import { photoText } from "@/lib/images";
import { ordinal } from "@/lib/ordinal";

/* SAMPLE COPY in `content/about.json`, with two exceptions that are real and
   are not rewritten for voice: the three Leadership cards, and the philosophy
   pull-quote. The quote's attribution is still empty — the words are real,
   the name is not here yet, and it says so rather than going unsourced. */

const { hero, story, leadership, sections, philosophy, differences } = about;

/* Light or dark copy over each of the two photo-backed sections, from those
   slots' own text modes. `Nav` reads the hero's for this route. */
const heroText = photoText(hero.photo);
const philosophyText = photoText(philosophy.photo);

export default function AboutPage() {
  return (
    <>
      <PhotoHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        photo={hero.photo}
        left={
          <p className={`type-body ${heroText.body} max-w-xs`}>{hero.left}</p>
        }
        right={
          <p className={`type-lead ${heroText.strong} max-w-md`}>{hero.right}</p>
        }
      />

      {/* One — Our Story: headline over a wide photograph */}
      <section className="bg-cream text-ink">
        <div className="wrap">
          <SectionHeader index={ordinal(0)} eyebrow={story.eyebrow} />

          <div className="grid grid-cols-1 lg:grid-cols-4">
            <h2
              className="type-h2 lg:col-span-2 py-12 lg:py-24 lg:pr-10"
              data-reveal
            >
              {story.title}
            </h2>
          </div>

          <PhotoFrame
            photo={story.photo}
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
              <p className="type-lead text-ink max-w-sm">{story.lead}</p>
            </div>
            <div
              className="lg:border-l border-hair lg:pl-8 mt-8 lg:mt-0"
              data-reveal
              style={{ transitionDelay: "90ms" }}
            >
              <p className="type-body text-olive max-w-sm">{story.body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Two — Leadership: three real, named people. Their headshots are not
          here yet, so each photo slot keeps its labelled pending frame. */}
      <ProfileGrid
        index={ordinal(1)}
        eyebrow={leadership.eyebrow}
        title={leadership.title}
        intro={
          <p className="type-lead text-ink max-w-lg">{leadership.intro}</p>
        }
        cards={leadership.cards}
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
        eyebrow={philosophy.eyebrow}
        title={philosophy.title}
        photo={philosophy.photo}
        quote={
          /* Real words get real treatment; only an empty slot gets the
             labelled frame. The two used to be one field, so a quote typed
             into the frame's own note rendered as a placeholder. */
          philosophy.quote ? (
            <figure className="flex flex-col items-start gap-5">
              <blockquote
                className={`type-display type-h3 ${philosophyText.strong} max-w-sm`}
              >
                &ldquo;{philosophy.quote}&rdquo;
              </blockquote>
              <figcaption>
                {philosophy.quoteAttribution ? (
                  <BulletLabel className={philosophyText.label}>
                    {philosophy.quoteAttribution}
                  </BulletLabel>
                ) : (
                  /* The words are real; the name is not here yet, and that
                     part stays visibly unfinished rather than unsourced. */
                  <Placeholder
                    tone={philosophyText.tone}
                    onPhoto
                    note={philosophy.attributionNote}
                  />
                )}
              </figcaption>
            </figure>
          ) : (
            <Placeholder
              tone={philosophyText.tone}
              lead
              onPhoto
              note={philosophy.quoteNote}
            />
          )
        }
        support={
          <p className={`type-body ${philosophyText.label} max-w-sm`}>
            {philosophy.support}
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
        eyebrow={differences.eyebrow}
        title={differences.title}
        intro={
          <p className="type-lead text-white max-w-lg">{differences.intro}</p>
        }
        features={differences.features.map((f) => ({
          icon: <Icon name={f.icon} className="w-full h-full" />,
          label: f.label,
          body: f.body,
        }))}
      />

      <RequestSection index={ordinal(9)} />
    </>
  );
}
