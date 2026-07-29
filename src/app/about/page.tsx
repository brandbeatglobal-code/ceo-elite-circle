import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="The Circle" title="About the Circle" />
      <Section title="Our Story" tone="stone" />
      <Section title="Our Purpose" />
      <Section title="Our Beliefs" tone="stone" />
      <Section title="Our Mission" />
      <Section title="Our Vision" tone="stone" />
      <Section title="Leadership Philosophy" />
      <Section title="Who We Serve" tone="stone" />
      <Section title="What Makes Us Different" />
    </>
  );
}
