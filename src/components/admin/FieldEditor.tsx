"use client";

import { useActionState, useId, useState } from "react";
import type { FieldRule } from "@/lib/admin/schema";
import { saveField, type SaveState } from "@/app/admin/(panel)/content/[file]/actions";

const initial: SaveState = { status: "idle" };

/**
 * One editable field, with its own save.
 *
 * The input is deliberately not reset from the server after a save. In
 * production the panel still reads the previous value from disk until the
 * deploy lands, so snapping the box back to the old text would read as the
 * save having failed. What the editor typed stays on screen, and the
 * confirmation says when it will be live.
 */
export function FieldEditor({
  file,
  path,
  label,
  value,
  rule,
}: {
  file: string;
  path: string;
  label: string;
  value: string | null;
  rule: FieldRule;
}) {
  const [state, formAction, pending] = useActionState(saveField, initial);
  const [draft, setDraft] = useState(value ?? "");
  const id = useId();

  const dirty = draft !== (value ?? "");
  const structural = Boolean(rule.structural);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="file" value={file} />
      <input type="hidden" name="path" value={path} />

      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="type-label text-olive">
          {label}
        </label>
        {structural && (
          <span className="type-label text-sage shrink-0">
            • Structural field
          </span>
        )}
      </div>

      {rule.multiline ? (
        <textarea
          id={id}
          name="value"
          rows={Math.min(10, Math.max(3, Math.ceil(draft.length / 70)))}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className={`admin-field ${structural ? "admin-field-structural" : ""}`}
        />
      ) : (
        <input
          id={id}
          name="value"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className={`admin-field ${structural ? "admin-field-structural" : ""}`}
        />
      )}

      {rule.structural && (
        <p className="type-label text-olive italic border-l-2 border-sage pl-3 max-w-xl">
          {rule.structural}
        </p>
      )}

      {/* Only the unusual case is annotated, and only where the field's own
          structural note has not already said something more precise. Most
          fields are required; saying so on every one would drown out the
          notes that actually matter. */}
      {!structural &&
        (value === null ? (
          <p className="type-label text-olive italic">
            Currently empty — the page renders its labelled placeholder here.
          </p>
        ) : (
          rule.nullable && (
            <p className="type-label text-olive/70">
              Can be cleared — the page then renders its labelled placeholder.
            </p>
          )
        ))}

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
