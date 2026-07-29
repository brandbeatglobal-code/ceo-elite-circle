import { MediaSection } from "@/components/MediaSection";
import { Carousel } from "@/components/Carousel";
import { PhotoCard } from "@/components/PhotoCard";
import { RequestSection } from "@/components/RequestSection";
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
import { pillars } from "@/lib/pillars";
import { experiences } from "@/lib/experiences";
import { membershipCategoriesIntro, tiers as tierCopy } from "@/lib/copy";

const tiers = [
  { ...tierCopy[0], photo: photos.tierExecutive },
  { ...tierCopy[1], photo: photos.tierElite },
  { ...tierCopy[2], photo: photos.tierChairman },
];

const featured = experiences.find((e) => e.slug === "ceo-private-dinners")!;
const otherExperiences = experiences.filter((e) => e !== featured);

export default function Home() {
  return (
    <>
      {/* ---- Hero — full-bleed photograph, serif headline, full-width pill CTA */}
      <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
        <PhotoFrame
          photo={photos.hero}
          cover
          className="h-full"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />

        {/* The hairline grid carries over the photograph */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          <div className="wrap h-full grid grid-cols-4">
            <div />
            <div className="border-l border-white/15" />
            <div className="border-l border-white/15" />
            <div className="border-l border-white/15" />
          </div>
        </div>

        <div className="wrap relative pt-36 lg:pt-44 hero-foot">
          <h1 className="type-display type-hero text-white mb-10">
            A Private Circle for
            <br />
            Distinguished
            <br />
            <span className="lg:ml-[18%]">Business Leaders.</span>
          </h1>

          <div className="max-w-sm mb-10">
            <p className="type-body text-white mb-3">
              Leadership was never meant to be experienced alone.
            </p>
            <p className="type-body text-white/75">
              Built on trust, guided by integrity, and united by a shared
              commitment to excellence, the CEO Elite Circle brings together
              accomplished business leaders in a confidential environment where
              meaningful relationships, thoughtful dialogue, and strategic
              collaboration shape the future of leadership.
            </p>
          </div>

          <PillButton href="/contact" variant="outline" className="w-full">
            Request Membership Consideration
          </PillButton>
        </div>
      </section>

      {/* ---- One — Our Philosophy */}
      <section className="bg-ramp text-white">
        <div className="wrap">
          <SectionHeader
            index={ordinal(0)}
            eyebrow="Our Philosophy"
            link={{ href: "/about", label: "More about the Circle" }}
            tone="ramp"
          />

          <div className="pt-24 pb-16 lg:pt-52 lg:pb-40">
            {/* Staggered headline — begins mid-grid, then runs full width */}
            <h2 className="type-h2 lg:[text-indent:44%] max-w-6xl">
              Why the Circle Exists
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-14 mt-24 lg:mt-48">
              <div className="hidden lg:block" />
              <div className="lg:border-l border-hair-dark lg:pl-8 flex flex-col items-start gap-8">
                <p className="type-lead text-white max-w-sm">
                  Leadership at this level is unusually well supplied with
                  advice, and unusually short of counsel.
                </p>
              </div>
              <div className="lg:border-l border-hair-dark lg:pl-8 flex flex-col items-start gap-8">
                <p className="type-body text-white/75 max-w-sm">
                  Boards want reassurance, executives want direction, advisers
                  want a mandate. Very few rooms want nothing at all. The Circle
                  exists to be one of them — somewhere a chief executive can
                  think aloud among people who have carried the same weight, and
                  where the conversation is not also a transaction.
                </p>
                <ArrowLink href="/about" tone="ramp">
                  Discover the Circle
                </ArrowLink>
              </div>
              <div className="hidden lg:block" />
            </div>
          </div>
        </div>
      </section>

      {/* ---- Two — The Five Pillars */}
      <section className="bg-black text-white">
        <div className="wrap">
          <SectionHeader
            index={ordinal(1)}
            eyebrow="Structure"
            link={{ href: "/pillars", label: "All pillars" }}
            tone="black"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair-dark">
            <h2 className="type-h2 col-span-1 lg:col-span-2 py-12 lg:py-24 lg:pr-10">
              The Five Pillars
            </h2>
            <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 pb-12 lg:py-24">
              <p className="type-lead text-white max-w-lg">
                Five pillars carry the work of the Circle: counsel, connection,
                closed conversation, considered analysis, and standing groups
                that meet through the year.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-hair-dark">
            {pillars.map((pillar, i) => (
              <PhotoCard
                key={pillar.slug}
                label="Pillar"
                index={ordinal(i)}
                title={pillar.name}
                body={pillar.summary}
                photo={pillar.photo}
                href={`/pillars/${pillar.slug}`}
                linkLabel="Discover the Circle"
                delay={i * 70}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---- Three — Why Now */}
      <MediaSection
        index={ordinal(2)}
        eyebrow="Timing"
        title="Why Now"
        photo={photos.whyNow}
        link={{ href: "/about", label: "Discover the Circle" }}
      >
        <p className="type-lead text-ink max-w-md">
          The demands on a chief executive have rarely shifted faster, and the
          rooms in which to think about them properly have rarely been fewer.
        </p>
        <p className="type-body text-olive max-w-md">
          Conferences have grown; conversations have not. The Circle was formed
          in the gap between the two.
        </p>
      </MediaSection>

      {/* ---- Four — Membership Categories */}
      <section className="bg-cream text-ink">
        <div className="wrap">
          <SectionHeader
            index={ordinal(3)}
            eyebrow="Membership"
            link={{ href: "/membership", label: "All categories" }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair">
            <h2 className="type-h2 lg:col-span-2 py-12 lg:py-24 lg:pr-10">
              Membership Categories
            </h2>
            <div className="lg:col-span-2 lg:border-l border-hair lg:pl-8 pb-12 lg:py-24">
              <p className="type-lead text-ink max-w-lg">
                {membershipCategoriesIntro}
              </p>
            </div>
          </div>

          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair"
            >
              <div className="flex flex-col justify-between py-16 lg:py-14 lg:pr-8 gap-8">
                <BulletLabel className="text-olive">Category</BulletLabel>
                <ArrowLink href="/membership">Discover the Circle</ArrowLink>
              </div>

              <div className="lg:col-span-2 lg:border-l border-hair lg:pl-8 py-16 lg:py-14 flex flex-col justify-between gap-8">
                <p className="type-lead text-ink max-w-md">{tier.body}</p>
                <h3 className="type-body text-ink">{tier.name}</h3>
              </div>

              <div className="lg:border-l border-hair lg:pl-8 py-16 lg:py-14">
                <PhotoFrame
                  photo={tier.photo}
                  greyscale
                  className="h-40 lg:h-44"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Five — Governance and selection */}
      <section className="bg-cream text-ink">
        <div className="wrap">
          <SectionHeader
            index={ordinal(4)}
            eyebrow="Governance"
            link={{ href: "/trust", label: "Trust framework" }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-10 pt-16 pb-16 lg:pt-44 lg:pb-36">
            <div className="flex flex-col items-start gap-8 lg:pr-8 order-2 lg:order-1 lg:justify-end">
              <p className="type-lead max-w-xs">
                A closed room is only as good as the terms that hold it.
              </p>
              <ArrowLink href="/trust">Discover the Circle</ArrowLink>
            </div>

            <div className="flex flex-col items-start gap-8 lg:border-l border-hair lg:pl-8 order-3 lg:order-2 lg:justify-end">
              <p className="type-body text-olive max-w-xs">
                The Trust Framework sets out how the Circle is governed, what
                members undertake, and how membership is reviewed. Selection
                follows from it: fit is considered before qualification, and the
                answer is given plainly either way.
              </p>
              <ArrowLink href="/membership">Membership Selection</ArrowLink>
            </div>

            <div className="lg:col-span-2 lg:border-l border-hair lg:pl-10 order-1 lg:order-3">
              <h2 className="type-h2 max-w-xl">Trust Framework</h2>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Six — Signature Experiences */}
      <section className="bg-black text-white">
        <div className="wrap">
          <SectionHeader
            index={ordinal(5)}
            eyebrow="Experiences"
            link={{ href: "/experiences", label: "All experiences" }}
            tone="black"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair-dark">
            <h2 className="type-h2 lg:col-span-2 py-12 lg:py-24 lg:pr-10">
              Signature Experiences
            </h2>
            <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 pb-12 lg:py-24">
              <p className="type-lead text-white max-w-lg">
                Seven occasions across the year, each built for a different kind
                of conversation — from the whole membership in one room to a
                single table of twelve.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4">
            {/* Featured experience — text beside its photograph */}
            <div className="py-14 lg:pr-8 flex flex-col justify-between gap-10">
              <div>
                <h3 className="type-display type-h3 text-white mb-5">
                  {featured.name}
                </h3>
                <p className="type-body text-white/70">{featured.summary}</p>
              </div>
              <ArrowLink href={`/experiences/${featured.slug}`} tone="black">
                Discover the Circle
              </ArrowLink>
            </div>

            <div className="lg:border-l border-hair-dark lg:pl-8 py-14">
              <PhotoFrame
                photo={photos.privateDinners}
                className="h-72 lg:h-full lg:min-h-[24rem]"
                sizes="(max-width: 1024px) 100vw, 25vw"
                tone="black"
              />
            </div>

            {/* The remaining six, as a hairline list */}
            <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 py-14">
              {otherExperiences.map((experience) => (
                <div
                  key={experience.slug}
                  className="flex items-baseline justify-between gap-6 border-b border-hair-dark py-5 first:pt-0"
                >
                  <h3 className="type-display text-xl md:text-2xl text-white">
                    {experience.name}
                  </h3>
                  <ArrowLink
                    href={`/experiences/${experience.slug}`}
                    tone="black"
                    className="shrink-0"
                  >
                    Discover
                  </ArrowLink>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Seven — Testimonials */}
      <section className="bg-black text-white">
        <div className="wrap">
          <SectionHeader
            index={ordinal(6)}
            eyebrow="Testimonials"
            tone="black"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="lg:col-span-1 flex flex-col justify-end py-12 lg:py-28 lg:pr-8">
              <h2 className="type-h2 mb-8">What Members Say</h2>
              <p className="type-body text-white/55 italic max-w-xs">
                No member quotes have been given or approved yet, so none are
                shown — these cards are structure only.
              </p>
            </div>

            <div className="hidden lg:block border-l border-hair-dark" />

            <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8">
              <Carousel>
                {[0, 1, 2].map((i) => (
                  <article
                    key={i}
                    className="snap-start shrink-0 w-[78vw] sm:w-[22rem] flex flex-col gap-5"
                  >
                    <BulletLabel className="text-white/55">
                      Awaiting member approval
                    </BulletLabel>
                    <Placeholder tone="black" />
                  </article>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Eight — Request Membership Consideration */}
      <RequestSection index={ordinal(7)} />
    </>
  );
}
