"use client";

import { useActionState } from "react";
import { usePathname } from "next/navigation";
import { submitForm, type SubmitState } from "@/app/(site)/submit";
import type { FormColumnSpec, FieldSpec } from "@/lib/formSpec";

const initial: SubmitState = { status: "idle" };

/**
 * The fields of any of the nine forms, and the submit.
 *
 * A client component only so it can show its own sending, sent and failed
 * states — the submission itself is a server action, and nothing about the
 * mail credentials is reachable from here. `formSpec` is imported for its
 * types and shapes; `mail.ts`, which reads the key, is `server-only` and is
 * never in this import graph.
 *
 * Two states are rendered honestly rather than optimistically: while it is
 * sending the button says so and is disabled, and a failure says the message
 * was not sent. Nothing claims success unless the server said so.
 *
 * Deliberately no `data-reveal` on the fields, though the section around them
 * has it: a refusal remounts them (see `generation` below), and a remounted
 * element has never been seen by the observer in `Reveal.tsx` — it would stay
 * hidden. Content is visible by default here, which is the safe direction.
 */
export function RequestForm({
  kind,
  columns,
  cta,
  context,
  consentLabel,
  children,
}: {
  kind: string;
  columns: FormColumnSpec[];
  cta: string;
  /** Pre-filled context — the pillar or experience the page is about. */
  context?: { label: string; value: string };
  /** Only `/contact` carries one. */
  consentLabel?: string;
  /** Rendered between the fields and the button. */
  children?: React.ReactNode;
}) {
  const [state, action, pending] = useActionState(submitForm, initial);
  const pathname = usePathname();
  const single = columns.length === 1;

  // React clears an uncontrolled form once its action finishes. That is right
  // after a send and wrong after a refusal, so a refusal hands the answers back
  // and `attempt` remounts the fields with them as their defaults — changing a
  // `defaultValue` alone would not reach an input that is already mounted.
  const restored = state.status === "error" ? state.values : undefined;
  const consented = state.status === "error" ? state.consent : false;
  const generation = state.status === "error" ? state.attempt : 0;

  return (
    <form action={action}>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="page" value={pathname} />
      {context && (
        <input type="hidden" name="context" value={context.value} />
      )}

      {/* Honeypot. Off-screen rather than `display:none`, which some bots
          check for, and taken out of the accessibility tree and the tab order
          so nobody using a keyboard or a screen reader can land in it. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden">
        <label>
          Company
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div key={generation} className="grid grid-cols-1 lg:grid-cols-4 py-12 lg:py-28">
        <div className="hidden lg:block" />

        <div className={`lg:pr-8 ${single ? "lg:col-span-2" : ""}`}>
          {context && (
            // Inert on purpose: the visitor can see the context the form
            // carries, and cannot mistype it.
            <div className="border border-hair-dark px-4 py-3 mb-8 flex flex-col gap-1">
              <span className="type-label text-white/55">{context.label}</span>
              <span className="type-body text-white">{context.value}</span>
            </div>
          )}
          <Column column={columns[0]} disabled={pending} restored={restored} />
        </div>

        {columns[1] && (
          <div className="lg:border-l border-hair-dark lg:pl-8 mt-12 lg:mt-0">
            <Column column={columns[1]} disabled={pending} restored={restored} />
          </div>
        )}

        <div className="hidden lg:block" />
      </div>

      <div className="pb-20 flex flex-col items-center gap-8">
        {consentLabel && (
          <label className="type-label text-white/70 flex items-center gap-3">
            <input
              key={generation}
              type="checkbox"
              name="consent"
              className="accent-sage"
              defaultChecked={consented}
              disabled={pending}
            />
            {consentLabel}
          </label>
        )}

        {children}

        <button
          type="submit"
          disabled={pending}
          className="pill type-link bg-white text-ink w-full max-w-2xl px-8 py-4 inline-flex items-center justify-center gap-2 hover:bg-mint transition-colors disabled:opacity-55 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          <span aria-hidden="true">•</span>
          {pending ? "Sending…" : cta}
        </button>

        {state.status === "sent" && (
          <p className="type-body text-white text-center max-w-md" role="status">
            {state.message}
          </p>
        )}
        {state.status === "error" && (
          <p
            className="type-body text-white text-center max-w-md border-l-2 border-sage pl-4"
            role="alert"
          >
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

function Column({
  column,
  disabled,
  restored,
}: {
  column: FormColumnSpec;
  disabled: boolean;
  restored?: Record<string, string>;
}) {
  return (
    <>
      <p className="type-link text-white mb-7">{column.legend}</p>
      <div className="flex flex-col gap-6">
        {column.fields.map((f) => (
          <Field
            key={f.label}
            field={f}
            disabled={disabled}
            value={restored?.[f.label] ?? ""}
          />
        ))}
      </div>
    </>
  );
}

function Field({
  field,
  disabled,
  value,
}: {
  field: FieldSpec;
  disabled: boolean;
  /** What a refused submission handed back, or "" on a fresh form. */
  value: string;
}) {
  const label = field.required ? `${field.label} *` : field.label;

  if (field.kind === "select") {
    return (
      <select
        name={field.label}
        className="field"
        aria-label={label}
        required={field.required}
        disabled={disabled}
        defaultValue={field.options?.includes(value) ? value : ""}
      >
        <option value="">{field.label}</option>
        {field.options?.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={field.kind}
      name={field.label}
      className="field"
      placeholder={label}
      aria-label={label}
      required={field.required}
      disabled={disabled}
      defaultValue={value}
      autoComplete={
        field.label === "Email"
          ? "email"
          : field.label === "Name"
            ? "given-name"
            : field.label === "Surname"
              ? "family-name"
              : field.label === "Phone number"
                ? "tel"
                : "off"
      }
    />
  );
}
