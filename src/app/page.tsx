import { MediaSection } from "@/components/MediaSection";
import { Carousel } from "@/components/Carousel";
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

const pillars = [
  "Strategic Advisory",
  "Elite Network",
  "Executive Forums",
  "Knowledge & Insights",
  "Executive Councils",
];

const tiers = [
  { name: "Executive Circle", photo: photos.tierExecutive },
  { name: "Elite Circle", photo: photos.tierElite },
  { name: "Chairman's Circle", photo: photos.tierChairman },
];

const featuredExperience = "CEO Private Dinners";

const otherExperiences = [
  "CEO Leadership Summit",
  "Chairman's Majlis",
  "Executive Leadership Retreat",
  "Future Leadership Forum",
  "CEO Excellence Awards",
  "International CEO Delegation",
];

export default function Home() {
  return (
    <>
      {/* ---- Hero — full-bleed photograph, serif headline, full-width pill CTA */}
      <section className="relative min-h-[42rem] h-[100svh] flex flex-col justify-end overflow-hidden">
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

        <div className="wrap relative pb-8">
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

          <div className="pt-24 pb-16 lg:pt-40 lg:pb-28">
            {/* Staggered headline — begins mid-grid, then runs full width */}
            <h2 className="type-h2 lg:[text-indent:44%] max-w-6xl">
              Why the Circle Exists
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-10 mt-20 lg:mt-40">
              <div className="hidden lg:block" />
              <div className="lg:border-l border-hair-dark lg:pl-8 flex flex-col items-start gap-6">
                <Placeholder tone="ramp" lead />
              </div>
              <div className="lg:border-l border-hair-dark lg:pl-8 flex flex-col items-start gap-6">
                <Placeholder tone="ramp" />
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
            <h2 className="type-h2 col-span-1 lg:col-span-2 py-12 lg:py-16 lg:pr-10">
              The Five Pillars
            </h2>
            <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 pb-12 lg:py-16">
              <Placeholder tone="black" lead />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {pillars.map((name, i) => (
              <article
                key={name}
                className={`flex flex-col pt-8 pb-10 px-0 sm:px-6 lg:px-5 first:sm:pl-0 first:lg:pl-0 ${
                  i > 0 ? "sm:border-l border-hair-dark" : ""
                } border-t sm:border-t-0 border-hair-dark`}
              >
                <BulletLabel className="text-white/60">Pillar</BulletLabel>
                <p className="type-body text-white mt-2 pb-4 mb-6 border-b border-hair-dark">
                  {ordinal(i)}
                </p>
                <Placeholder tone="black" />
                <div className="mt-16 lg:mt-24">
                  <h3 className="type-display type-h3 text-white mb-4">
                    {name}
                  </h3>
                  <ArrowLink href="/pillars" tone="black">
                    Discover the Circle
                  </ArrowLink>
                </div>
              </article>
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
        <Placeholder lead />
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
            <h2 className="type-h2 lg:col-span-2 py-12 lg:py-16 lg:pr-10">
              Membership Categories
            </h2>
            <div className="lg:col-span-2 lg:border-l border-hair lg:pl-8 pb-12 lg:py-16">
              <Placeholder lead />
            </div>
          </div>

          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair"
            >
              <div className="flex flex-col justify-between py-8 lg:py-10 lg:pr-8 gap-8">
                <BulletLabel className="text-olive">Category</BulletLabel>
                <ArrowLink href="/membership">Discover the Circle</ArrowLink>
              </div>

              <div className="lg:col-span-2 lg:border-l border-hair lg:pl-8 py-8 lg:py-10 flex flex-col justify-between gap-8">
                <Placeholder lead />
                <h3 className="type-body text-ink">{tier.name}</h3>
              </div>

              <div className="lg:border-l border-hair lg:pl-8 py-8 lg:py-10">
                <PhotoFrame
                  photo={tier.photo}
                  greyscale
                  className="h-52 lg:h-44"
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-10 pt-16 pb-16 lg:pt-32 lg:pb-24">
            <div className="flex flex-col items-start gap-6 lg:pr-8 order-2 lg:order-1 lg:justify-end">
              <Placeholder lead />
              <ArrowLink href="/trust">Discover the Circle</ArrowLink>
            </div>

            <div className="flex flex-col items-start gap-6 lg:border-l border-hair lg:pl-8 order-3 lg:order-2 lg:justify-end">
              <Placeholder />
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
            <h2 className="type-h2 lg:col-span-2 py-12 lg:py-16 lg:pr-10">
              Signature Experiences
            </h2>
            <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 pb-12 lg:py-16">
              <Placeholder tone="black" lead />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4">
            {/* Featured experience — text beside its photograph */}
            <div className="py-10 lg:pr-8 flex flex-col justify-between gap-10">
              <div>
                <h3 className="type-display type-h3 text-white mb-5">
                  {featuredExperience}
                </h3>
                <Placeholder tone="black" />
              </div>
              <ArrowLink href="/experiences" tone="black">
                Discover the Circle
              </ArrowLink>
            </div>

            <div className="lg:border-l border-hair-dark lg:pl-8 py-10">
              <PhotoFrame
                photo={photos.privateDinners}
                className="h-72 lg:h-full lg:min-h-[24rem]"
                sizes="(max-width: 1024px) 100vw, 25vw"
                tone="black"
              />
            </div>

            {/* The remaining six, as a hairline list */}
            <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 py-10">
              {otherExperiences.map((name) => (
                <div
                  key={name}
                  className="flex items-baseline justify-between gap-6 border-b border-hair-dark py-5 first:pt-0"
                >
                  <h3 className="type-display text-xl md:text-2xl text-white">
                    {name}
                  </h3>
                  <ArrowLink href="/experiences" tone="black" className="shrink-0">
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
            <div className="lg:col-span-1 flex flex-col justify-end py-12 lg:py-20 lg:pr-8">
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
      <section className="bg-ramp-low text-white">
        <div className="wrap">
          <SectionHeader index={ordinal(7)} eyebrow="Begin" tone="ramp-low" />

          <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair-dark">
            <div className="hidden lg:block lg:col-span-2" />
            <div className="lg:col-span-2 lg:border-l border-hair-dark lg:pl-8 py-14 lg:py-20">
              <h2 className="type-h2 mb-10">
                Request Membership Consideration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <p className="type-lead text-white max-w-xs">
                  Membership in the CEO Elite Circle is by invitation and
                  consideration only.
                </p>
                <Placeholder tone="ramp-low" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 py-14 lg:py-20">
            <div className="hidden lg:block" />

            <div className="lg:pr-8">
              <p className="type-link text-white mb-7">Contact information</p>
              <div className="flex flex-col gap-6">
                {["Name", "Surname", "Phone number", "Email"].map((f) => (
                  <input
                    key={f}
                    className="field"
                    placeholder={f}
                    aria-label={f}
                    disabled
                  />
                ))}
              </div>
            </div>

            <div className="lg:border-l border-hair-dark lg:pl-8 mt-12 lg:mt-0">
              <p className="type-link text-white mb-7">Membership details</p>
              <div className="flex flex-col gap-6">
                {[
                  "Membership category",
                  "Region",
                  "Introduced by",
                  "Preferred contact",
                ].map((f) => (
                  <select key={f} className="field" aria-label={f} disabled>
                    <option>{f}</option>
                  </select>
                ))}
              </div>
            </div>

            <div className="hidden lg:block" />
          </div>

          <div className="pb-20 flex flex-col items-center gap-8">
            <p className="type-label text-white/55 italic text-center max-w-md">
              Fields are not yet wired up — the application questions are still
              being confirmed. The button below opens the full request page.
            </p>
            <PillButton
              href="/contact"
              variant="light"
              className="w-full max-w-2xl"
            >
              Request Membership Consideration
            </PillButton>
          </div>
        </div>
      </section>
    </>
  );
}
