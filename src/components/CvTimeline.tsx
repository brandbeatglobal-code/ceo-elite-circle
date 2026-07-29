import { ReactNode } from "react";

export type CvRow = { period: ReactNode; title: ReactNode };

/**
 * Alternating vertical CV timeline: a centre line with entries stepping
 * left and right down the page. Distinct from the About page's milestone list,
 * which runs as one straight column.
 *
 * Collapses to a single left-aligned column below `lg`, where alternating
 * would only make it harder to read.
 */
export function CvTimeline({ rows }: { rows: CvRow[] }) {
  return (
    <div className="relative py-8">
      {/* The centre line — left edge on small screens, mid-grid on large. */}
      <div className="absolute top-0 bottom-0 left-0 lg:left-1/2 border-l border-hair-dark" />

      <div className="flex flex-col gap-12">
        {rows.map((row, i) => {
          const right = i % 2 === 0;
          return (
            <div key={i} className="grid grid-cols-1 lg:grid-cols-2 relative">
              {/* Dot on the line */}
              <span
                className="absolute w-1.5 h-1.5 rounded-full bg-sage -left-[3px] lg:left-1/2 lg:-translate-x-1/2 top-1.5"
                aria-hidden="true"
              />

              {right ? (
                <>
                  <div className="hidden lg:block" />
                  <div className="pl-6 lg:pl-8 flex flex-col gap-3 items-start">
                    {row.period}
                    {row.title}
                  </div>
                </>
              ) : (
                <>
                  <div className="pl-6 lg:pl-0 lg:pr-8 flex flex-col gap-3 items-start lg:items-end lg:text-right">
                    {row.period}
                    {row.title}
                  </div>
                  <div className="hidden lg:block" />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
