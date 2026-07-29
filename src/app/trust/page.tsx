import { PageHero } from "@/components/PageHero";
import { RequestSection } from "@/components/RequestSection";
import { Section } from "@/components/Section";
import { ordinal } from "@/lib/ordinal";

const sections = [
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

export default function TrustPage() {
  return (
    <>
      <PageHero
        eyebrow="Governance"
        title="Trust Framework"
        intro="This page carries policy-level content. Nothing below is final — every statement here needs sign-off before it goes live."
      />
      {sections.map((title, i) => (
        <Section key={title} index={ordinal(i)} title={title} />
      ))}
      <RequestSection index={ordinal(sections.length)} />
    </>
  );
}
