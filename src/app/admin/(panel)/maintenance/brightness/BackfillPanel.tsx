"use client";

import { useActionState } from "react";
import {
  backfillBrightness,
  type BackfillState,
} from "@/app/admin/(panel)/maintenance/brightness/actions";

const initial: BackfillState = { status: "idle" };

/**
 * ONE-TIME MAINTENANCE — delete with the rest of this route once it has run.
 *
 * Deliberately plain: one button, then the before/after of every slot it
 * touched, so the run leaves a record rather than a claim.
 */
export function BackfillPanel({ pending: outstanding }: { pending: number }) {
  const [state, formAction, running] = useActionState(backfillBrightness, initial);
  const rows = state.status === "idle" ? [] : (state.rows ?? []);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction}>
        <button
          type="submit"
          disabled={running || outstanding === 0}
          className="pill type-link inline-flex items-center gap-2 px-8 py-4 bg-ink text-white hover:bg-sage transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span aria-hidden="true">•</span>
          {running
            ? "Measuring…"
            : outstanding === 0
              ? "Nothing left to measure"
              : `Measure ${outstanding} photograph${outstanding === 1 ? "" : "s"}`}
        </button>
      </form>

      {state.status === "error" && (
        <p role="alert" className="type-body text-ink border-l-2 border-sage pl-3 max-w-xl">
          Stopped — {state.message}
        </p>
      )}
      {state.status === "done" && (
        <p role="status" className="type-body text-ink border-l-2 border-sage pl-3 max-w-xl">
          {state.message}
        </p>
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="type-label text-olive border-collapse min-w-full">
            <thead>
              <tr className="text-left border-b border-hair">
                <th className="py-2 pr-6 font-medium text-ink">Slot</th>
                <th className="py-2 pr-6 font-medium text-ink">Before</th>
                <th className="py-2 pr-6 font-medium text-ink">After</th>
                <th className="py-2 font-medium text-ink">Result</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.file}:${r.path}`} className="border-b border-hair align-top">
                  <td className="py-2 pr-6 text-ink">
                    {r.file} › {r.path}
                    <span className="block break-all text-olive">{r.src}</span>
                  </td>
                  <td className="py-2 pr-6">unmeasured</td>
                  <td className="py-2 pr-6 text-ink">{r.after ?? "—"}</td>
                  <td className="py-2">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
