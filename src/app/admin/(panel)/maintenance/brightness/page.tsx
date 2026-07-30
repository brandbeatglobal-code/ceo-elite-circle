import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { displayContent } from "@/lib/admin/content";
import { listContentFiles } from "@/lib/admin/registry";
import { isPhotoObject } from "@/lib/admin/validate";
import { BackfillPanel } from "@/app/admin/(panel)/maintenance/brightness/BackfillPanel";

export const dynamic = "force-dynamic";

export const metadata = { robots: { index: false, follow: false } };

/**
 * ONE-TIME MAINTENANCE — delete this whole folder once the backfill has run.
 *
 * Deliberately not linked from the admin's navigation: it is a job, not a
 * feature, and it should stop existing when the job is done.
 */
function countUnmeasured(value: unknown): number {
  if (value === null || typeof value !== "object") return 0;
  if (isPhotoObject(value)) {
    return value.src !== null &&
      value.brightness === null &&
      /^https?:\/\//.test(value.src)
      ? 1
      : 0;
  }
  if (Array.isArray(value)) return value.reduce<number>((n, v) => n + countUnmeasured(v), 0);
  return Object.values(value as Record<string, unknown>).reduce<number>(
    (n, v) => n + countUnmeasured(v),
    0,
  );
}

export default async function BrightnessBackfillPage() {
  await requireAdmin();

  // Counted from the repository, the same source the run itself will edit.
  let pending = 0;
  for (const listed of listContentFiles()) {
    const live = await displayContent(listed.name);
    pending += countUnmeasured(live?.cf.data);
  }

  return (
    <div className="wrap py-10 lg:py-14">
      <div className="max-w-5xl">
        <Link href="/admin" className="type-link text-olive hover:text-sage transition-colors">
          ← All content
        </Link>

        <div className="mt-6 border-b border-hair pb-8">
          <h1 className="type-display type-h3">Measure the remaining photographs</h1>
          <p className="type-body text-olive mt-3 max-w-xl">
            Photographs uploaded here are measured as they arrive, and the dark
            wash over each one is sized to what the picture actually needs. The
            slots filled by hand at design stage carry no measurement, so they
            get the heaviest treatment by default — safe, but heavier than most
            of them need.
          </p>
          <p className="type-body text-olive mt-3 max-w-xl">
            This reads each of those images from the address the site already
            points at, measures it, and records the number. The photographs
            themselves are not touched, moved or replaced.
          </p>
          <p className="type-label italic text-olive mt-3 max-w-xl border-l-2 border-sage pl-3">
            A one-time job rather than part of the admin. Once it has run and
            the numbers are in, this page can be removed.
          </p>
        </div>

        <div className="py-8">
          <BackfillPanel pending={pending} />
        </div>
      </div>
    </div>
  );
}
