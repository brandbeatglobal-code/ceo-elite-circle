import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

export default function TrustPage() {
  return (
    <>
      <PageHero
        eyebrow="Governance"
        title="Trust Framework"
        intro="This page carries policy-level content. Nothing below is final — every statement here needs sign-off before it goes live."
      />
      <Section title="Our Commitment" tone="stone" />
      <Section title="CEO Charter" />
      <Section title="Moderation Standards" tone="stone" />
      <Section title="Confidentiality" />
      <Section title="Governance" tone="stone" />
      <Section title="Member Conduct" />
      <Section title="Privacy" tone="stone" />
      <Section title="Conflict Resolution" />
      <Section title="Membership Review" tone="stone" />
      <Section title="Removal Policy" />
    </>
  );
}
