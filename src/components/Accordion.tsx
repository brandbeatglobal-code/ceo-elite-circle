"use client";

import { ReactNode, useId, useState } from "react";

export type AccordionItem = { title: ReactNode; body: ReactNode };

/**
 * Expandable list: one item open, the rest collapsed to a title and a `+`.
 *
 * The panel animates on `grid-template-rows` (see `.panel` in globals.css),
 * which gives a real height transition without measuring anything. Under
 * reduced motion the global rule collapses the duration, so it snaps.
 */
export function Accordion({
  items,
  tone = "cream",
  initial = 0,
}: {
  items: AccordionItem[];
  tone?: "cream" | "dark";
  /** Index open on first render; -1 for all closed. */
  initial?: number;
}) {
  const [open, setOpen] = useState(initial);
  const id = useId();
  const dark = tone === "dark";
  const rule = dark ? "border-hair-dark" : "border-hair";

  return (
    <div className={`border-t ${rule}`}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`border-b ${rule}`}>
            <h3>
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={`${id}-panel-${i}`}
                className="w-full flex items-start justify-between gap-6 py-5 text-left hover:text-sage transition-colors"
              >
                <span className="type-body">{item.title}</span>
                <span
                  className={`shrink-0 text-lg leading-none mt-0.5 ${
                    dark ? "text-white/55" : "text-olive"
                  }`}
                  aria-hidden="true"
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={`${id}-panel-${i}`}
              className="panel"
              data-open={isOpen}
              role="region"
            >
              <div>
                <div className="pb-6 max-w-xl">{item.body}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
