"use client";

import { useActionState, useState } from "react";
import {
  addSection,
  discardSections,
  moveSection,
  publishSections,
  removeSection,
  type StructureState,
} from "@/app/admin/(panel)/content/[file]/actions";
import type { SectionTypeSpec } from "@/lib/admin/sectionTypes";

const initial: StructureState = { status: "idle" };

export type OrderRow = { id: string; title: string; type: string };

/**
 * Move a section up or down, and settle what that produced.
 *
 * The controls are deliberately not the whole of B3 — no adding, no removing,
 * no choosing a layout. A move is the smallest genuinely structural thing a
 * page can do, which makes it the right thing to prove the propose → preview →
 * publish path with: it is real, it is useful on its own, and it cannot
 * produce a page shape that did not already exist.
 *
 * The numbers and the backgrounds shown here are computed the same way the
 * page computes them — from position — so the list reads as the page will.
 */
export function SectionOrder({
  file,
  rows,
  pending,
  types,
}: {
  file: string;
  rows: OrderRow[];
  /** The layouts this page can be given. Shown as a grid, never as a list of
   *  internal names — the same choice-by-looking the icon picker makes. */
  types: SectionTypeSpec[];
  pending: {
    summary: string | null;
    previewUrl: string;
    compareUrl: string;
    sha: string;
  } | null;
}) {
  const [moveState, moveAction, moving] = useActionState(moveSection, initial);
  const [addState, addAction, adding] = useActionState(addSection, initial);
  const [remState, remAction, removing] = useActionState(removeSection, initial);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [pubState, pubAction, publishing] = useActionState(publishSections, initial);
  const [discState, discAction, discarding] = useActionState(discardSections, initial);
  const busy = moving || publishing || discarding || adding || removing;
  const state =
    pubState.status !== "idle"
      ? pubState
      : discState.status !== "idle"
        ? discState
        : addState.status !== "idle"
          ? addState
          : remState.status !== "idle"
            ? remState
            : moveState;

  return (
    <section className="border-b border-hair py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div>
        <h2 className="type-body font-medium text-ink">Section order</h2>
        <p className="type-label text-olive italic mt-2">
          Numbers and backgrounds follow position, so they change with the order
          on their own.
        </p>
      </div>

      <div className="lg:col-span-3 lg:border-l border-hair lg:pl-8 flex flex-col gap-5">
        <ol className="flex flex-col">
          {rows.map((row, i) => (
            <li
              key={row.id}
              className="flex items-center justify-between gap-4 border-b border-hair py-3 first:pt-0"
            >
              <span className="flex items-baseline gap-3 min-w-0">
                <span className="type-label text-olive shrink-0 w-16">
                  {ORDINALS[i] ?? String(i + 1)}
                </span>
                <span className="type-body text-ink truncate">{row.title}</span>
                <span className="type-label text-olive/70 shrink-0">
                  {i % 2 === 1 ? "black" : "cream"}
                </span>
              </span>

              <span className="flex items-center gap-1.5 shrink-0">
                {/* Removing is the one action here that destroys something, so
                    it asks twice. The second press still only *proposes* it —
                    nothing is gone until the change is published. */}
                {confirming === row.id ? (
                  <form action={remAction} className="flex items-center gap-1.5">
                    <input type="hidden" name="file" value={file} />
                    <input type="hidden" name="id" value={row.id} />
                    <button
                      type="submit"
                      disabled={busy || rows.length === 1}
                      className="type-label border border-ink px-2.5 py-1.5 text-ink hover:bg-ink hover:text-white transition-colors disabled:opacity-30"
                    >
                      Remove “{row.title || "untitled"}”?
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirming(null)}
                      className="type-label text-olive hover:text-ink underline underline-offset-4"
                    >
                      Keep
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    disabled={busy || rows.length === 1}
                    onClick={() => setConfirming(row.id)}
                    aria-label={`Remove “${row.title}”`}
                    title={rows.length === 1 ? "A page cannot have no sections" : undefined}
                    className="type-label border border-hair px-2.5 py-1.5 text-olive hover:border-ink hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                )}
                {(["up", "down"] as const).map((dir) => {
                  const edge = dir === "up" ? i === 0 : i === rows.length - 1;
                  return (
                    <form action={moveAction} key={dir}>
                      <input type="hidden" name="file" value={file} />
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="direction" value={dir} />
                      <button
                        type="submit"
                        disabled={busy || edge}
                        aria-label={`Move “${row.title}” ${dir}`}
                        className="type-label border border-hair px-2.5 py-1.5 text-olive hover:border-olive hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-hair disabled:hover:text-olive"
                      >
                        <span aria-hidden="true">{dir === "up" ? "↑" : "↓"}</span>
                      </button>
                    </form>
                  );
                })}
              </span>
            </li>
          ))}
        </ol>

        {/* The closing form, shown so the list is not misleading about what is
            on the page — and shown as fixed, because it is. */}
        <p className="type-label text-olive italic">
          <span className="text-sage" aria-hidden="true">
            •
          </span>{" "}
          {ORDINALS[rows.length] ?? String(rows.length + 1)} is the closing form.
          It is always last, and it cannot be moved, removed or added — it is
          not one of the entries on this list.
        </p>

        {!picking ? (
          <p>
            <button
              type="button"
              disabled={busy}
              onClick={() => setPicking(true)}
              className="type-link text-sage hover:text-ink transition-colors disabled:opacity-40"
            >
              + Add a section
            </button>
          </p>
        ) : (
          <div className="border border-hair p-4 flex flex-col gap-4 max-w-3xl">
            <div className="flex items-baseline justify-between gap-4">
              <p className="type-label text-sage">• Choose a layout</p>
              <button
                type="button"
                onClick={() => setPicking(false)}
                className="type-label text-olive hover:text-ink underline underline-offset-4"
              >
                Cancel
              </button>
            </div>
            <p className="type-label text-olive italic max-w-xl">
              A new section is added at the end of the page, above the closing
              form, and starts completely empty — every field shows the site&rsquo;s
              “not written yet” frame until you fill it. Move it into place with
              the arrows once it is there.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {types.map((t) => (
                <form action={addAction} key={t.key}>
                  <input type="hidden" name="file" value={file} />
                  <input type="hidden" name="sectionType" value={t.key} />
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full text-left border border-hair p-3 hover:border-sage transition-colors disabled:opacity-40 flex flex-col gap-1.5"
                  >
                    <span className="type-body text-ink">{t.label}</span>
                    <span className="type-label text-olive">{t.shape}</span>
                    <span className="type-label text-olive/80 italic">
                      {t.description}
                    </span>
                  </button>
                </form>
              ))}
            </div>
          </div>
        )}

        {pending && (
          <div className="border border-hair bg-mint/20 p-4 flex flex-col gap-3 max-w-2xl">
            <p className="type-label text-sage">• Change pending, not yet live</p>
            <p className="type-body text-ink">
              {pending.summary ?? "This page has a structural change waiting."}
            </p>
            <p className="type-label text-olive italic">
              While this is pending, the text and photographs on this page are
              locked. Publishing puts it live; discarding throws it away and
              leaves the live page as it is.
            </p>
            <p className="flex flex-wrap gap-4">
              <a
                className="type-link text-sage hover:text-ink transition-colors"
                href={pending.previewUrl}
                target="_blank"
                rel="noreferrer"
              >
                See the preview ↗
              </a>
              <a
                className="type-link text-olive hover:text-ink transition-colors"
                href={pending.compareUrl}
                target="_blank"
                rel="noreferrer"
              >
                Exact changes ({pending.sha}) ↗
              </a>
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <form action={pubAction}>
                <input type="hidden" name="file" value={file} />
                <button
                  type="submit"
                  disabled={busy}
                  className="pill type-link bg-ink text-white px-5 py-2 inline-flex items-center gap-2 hover:bg-sage transition-colors disabled:opacity-40"
                >
                  <span aria-hidden="true">•</span>
                  {publishing ? "Publishing…" : "Publish"}
                </button>
              </form>
              <form action={discAction}>
                <input type="hidden" name="file" value={file} />
                <button
                  type="submit"
                  disabled={busy}
                  className="type-link text-olive hover:text-ink underline underline-offset-4 transition-colors disabled:opacity-40"
                >
                  {discarding ? "Discarding…" : "Discard"}
                </button>
              </form>
            </div>
          </div>
        )}

        {state.status === "done" && (
          <p className="type-label text-sage" role="status">
            {state.message}
          </p>
        )}
        {state.status === "error" && (
          <p className="type-label text-ink italic" role="alert">
            {state.message}
          </p>
        )}
      </div>
    </section>
  );
}

const ORDINALS = [
  "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen", "Twenty",
];
