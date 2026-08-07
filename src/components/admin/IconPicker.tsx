"use client";

import { useActionState, useId, useState } from "react";
import { ICON_KEYS, ICON_MEANINGS, Icon, type IconKey } from "@/components/Icons";
import type { FieldRule } from "@/lib/admin/schema";
import { saveField, type SaveState } from "@/app/admin/(panel)/content/[file]/actions";

const initial: SaveState = { status: "idle" };

/**
 * The mark above a label, chosen by looking at it.
 *
 * This field used to be read-only, and the reason was sound: it had been an
 * ordinary text input, and a key that does not exist in `Icons.tsx` leaves a
 * section with no mark to resolve. Locking it closed the typo but also closed
 * the field — the marks are part of the design, but *which* mark sits over
 * which words is a judgement about the words, and that is the editor's.
 *
 * A grid of the real drawings reopens it without reopening the bug: the value
 * is only ever one of `ICON_KEYS`, because the only way to set it is to press
 * one. There is no free-text path to an invalid key rather than a rule that
 * catches one — though `validateEdit` checks the key on the way in regardless,
 * since the form is not the only thing that can post to a server action.
 *
 * Each mark carries its meaning, from `ICON_MEANINGS`. The drawing says what
 * it looks like; the sentence says what it is for, which is the thing an
 * assignment is actually checkable against.
 */
export function IconPicker({
  file,
  path,
  label,
  value,
  rule,
}: {
  file: string;
  path: string;
  label: string;
  value: string;
  rule: FieldRule;
}) {
  const [state, formAction, pending] = useActionState(saveField, initial);
  const [choice, setChoice] = useState(value);
  const id = useId();

  const dirty = choice !== value;
  // An unknown stored key renders as `rings` on the site rather than throwing.
  // Say so here rather than showing a selected-looking grid with nothing in it.
  const known = (ICON_KEYS as string[]).includes(choice);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="file" value={file} />
      <input type="hidden" name="path" value={path} />
      <input type="hidden" name="value" value={choice} />

      <div className="flex items-baseline justify-between gap-4">
        <span className="type-label text-olive" id={`${id}-label`}>
          {label}
        </span>
        <span className="type-label text-sage shrink-0">• Design field</span>
      </div>

      <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 max-w-2xl"
      >
        {ICON_KEYS.map((key) => {
          const on = key === choice;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setChoice(key)}
              // Sage is a rule and an edge, never a fill — the palette rule in
              // docs/brief.md. The selected cell gets a sage border and its
              // name in sage; the cell itself stays on the panel's own ground.
              className={`flex flex-col items-center gap-1.5 px-1 py-2.5 border transition-colors ${
                on
                  ? "border-sage text-ink"
                  : "border-hair text-olive hover:border-olive hover:text-ink"
              }`}
              title={ICON_MEANINGS[key as IconKey]}
            >
              <Icon name={key} className="w-9 h-9" />
              <span className={`type-label ${on ? "text-sage" : ""}`}>{key}</span>
            </button>
          );
        })}
      </div>

      <p className="type-label text-olive italic max-w-xl">
        {known ? (
          <>
            <span className="text-sage" aria-hidden="true">
              •
            </span>{" "}
            {ICON_MEANINGS[choice as IconKey]}
          </>
        ) : (
          <>This section is set to “{choice}”, which is not one of the marks —
          the page is drawing the Circle’s own mark in its place. Choosing one
          above fixes it.</>
        )}
      </p>

      {rule.structural && (
        <p className="type-label text-olive italic border-l-2 border-sage pl-3 max-w-xl">
          {rule.structural}
        </p>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        <button
          type="submit"
          disabled={pending || !dirty}
          className="pill type-link bg-ink text-white px-5 py-2 inline-flex items-center gap-2 hover:bg-sage transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-ink"
        >
          <span aria-hidden="true">•</span>
          {pending ? "Saving…" : "Save"}
        </button>

        {dirty && !pending && state.status !== "saved" && (
          <span className="type-label text-olive italic">Unsaved change</span>
        )}
        {state.status === "saved" && (
          <span className="type-label text-sage" role="status">
            {state.message}
          </span>
        )}
        {state.status === "error" && (
          <span className="type-label text-ink italic" role="alert">
            Not saved — {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
