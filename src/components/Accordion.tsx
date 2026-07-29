"use client";

import { ReactNode, useState } from "react";

export type AccordionItem = { title: ReactNode; body: ReactNode };

/**
 * Expandable list: one item open, the rest collapsed to a title and a `+`.
 * Compact way to carry several related entries without a wall of open text.
 */
export function Accordion({
  items,
  tone = "cream",
}: {
  items: AccordionItem[];
  tone?: "cream" | "dark";
}) {
  const [open, setOpen] = useState(0);
  const dark = tone === "dark";
  const rule = dark ? "border-hair-dark" : "border-hair";

  return (
    <div className={`border-t ${rule}`}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`border-b ${rule}`}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className={`w-full flex items-start justify-between gap-6 py-5 text-left transition-colors ${
                dark ? "hover:text-sage" : "hover:text-sage"
              }`}
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
            {isOpen && <div className="pb-6 max-w-xl">{item.body}</div>}
          </div>
        );
      })}
    </div>
  );
}
