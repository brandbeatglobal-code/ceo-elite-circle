import { PageHero } from "@/components/PageHero";
import { RequestSection } from "@/components/RequestSection";
import { SectionList } from "@/components/SectionList";
import { councils } from "@/lib/councils";
import { ordinal } from "@/lib/ordinal";

export const metadata = { title: councils.metaTitle };

/* SAMPLE COPY in `content/councils.json`, except Expert Advisors, which names
   real people and so carries only a placeholder note.

   The pilot page for sections-as-content. Its body is no longer written out
   here: `content/councils.json` holds an ordered array, and `SectionList`
   renders it, handing each section its position and nothing else. Adding,
   removing or reordering an entry in that array is the whole change — the
   numbering and the background tones follow on their own.

   Note what is still in this file, deliberately. The hero comes first and the
   closing form comes last, both outside the array: the form takes
   `sections.length` as its index, so it stays the last number on the page
   whatever the array does, and there is no way to represent it as an entry to
   be moved or deleted. */

const { hero, sections } = councils;

export default function CouncilsPage() {
  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} intro={hero.intro} />

      <SectionList sections={sections} />

      <RequestSection index={ordinal(sections.length)} variant="council" />
    </>
  );
}
