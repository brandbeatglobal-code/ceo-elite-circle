import { councils } from "@/lib/councils";
import { forms, type RequestVariant } from "@/lib/forms";
import { membership } from "@/lib/membership";
import { trust } from "@/lib/trust";
import { contact } from "@/lib/contact";

/**
 * What each form actually holds, in one place.
 *
 * The renderer and the server-side validator both read this, so a field can
 * never be shown and then rejected as unknown, or accepted without ever having
 * been offered. Same discipline as `admin/schema.ts`.
 *
 * The field list itself still comes from `content/forms.json` — this layer only
 * says how each named field behaves.
 */

/** The nine forms. Eight closing-form variants plus `/contact`'s own. */
export type FormKind = RequestVariant | "contact";

export type FieldSpec = {
  label: string;
  kind: "text" | "email" | "tel" | "select";
  required: boolean;
  /** Only for `select`. */
  options?: string[];
};

/**
 * Selects that have a real list behind them, resolved from the content that
 * already defines it — so a dropdown and the page it names cannot drift.
 *
 * Anything not named here was a `<select>` in the design with **no options at
 * all**: one `<option>` carrying the field's own label. That is a control that
 * cannot be used, and a dropdown implies a defined set of answers that does not
 * exist — which the site's own rule about forms forbids. Those render as text
 * fields instead, so the visitor answers in their own words and the email
 * carries what they actually wrote.
 */
const SELECT_OPTIONS: Record<string, string[]> = {
  "Membership category": membership.categories.items.map((c) => c.name),
  "Area of the framework": trust.areas.items.map((a) => a.name),
  Council: councils.councils.items.map((c) => c.name),
  "Preferred contact": ["Email", "Phone"],
};

/** Name and email are what make a submission answerable. Nothing else is. */
const REQUIRED = new Set(["Name", "Email"]);

function spec(label: string): FieldSpec {
  const options = SELECT_OPTIONS[label];
  const kind: FieldSpec["kind"] = options
    ? "select"
    : label === "Email"
      ? "email"
      : label === "Phone number"
        ? "tel"
        : "text";
  return { label, kind, required: REQUIRED.has(label), ...(options ? { options } : {}) };
}

export type FormColumnSpec = { legend: string; fields: FieldSpec[] };

/** Every field of a form, in the order it is shown, grouped by column. */
export function formColumns(kind: FormKind): FormColumnSpec[] {
  if (kind === "contact") {
    const f = contact.form;
    return [
      { legend: f.contactLegend, fields: f.contactFields.map(spec) },
      { legend: f.detailsLegend, fields: f.detailsFields.map(spec) },
    ];
  }
  return forms[kind].columns.map((col) => ({
    legend: col.legend,
    fields: [...(col.inputs ?? []), ...(col.selects ?? [])].map(spec),
  }));
}

export function formFields(kind: FormKind): FieldSpec[] {
  return formColumns(kind).flatMap((c) => c.fields);
}

/**
 * Everything lands in one inbox, so the subject line is what tells them apart
 * at a glance. Wording is the site owner's, verbatim.
 */
const SUBJECTS: Record<FormKind, (v: Record<string, string>, ctx?: string) => string> = {
  membership: (v) => `Membership Request — ${v.Name}`,
  application: (v) => `Membership Application — ${v.Name}`,
  pillar: (v, ctx) => `Pillar Enquiry: ${ctx ?? "Unspecified"} — ${v.Name}`,
  experience: (v, ctx) => `Experience Enquiry: ${ctx ?? "Unspecified"} — ${v.Name}`,
  governance: (v) => `Governance Question — ${v.Name}`,
  council: (v) => `Council Interest — ${v.Name}`,
  briefings: (v) => `Briefings Subscription — ${v.Email}`,
  contact: (v) => `Contact Form — ${v.Name}`,
  // Not in the owner's list. It closes the leadership profile pages, which are
  // built but deliberately linked from nowhere, so no visitor can reach it
  // today. Named to the same pattern rather than left to fall through.
  enquiry: (v) => `Leadership Enquiry — ${v.Name}`,
};

export function subjectFor(
  kind: FormKind,
  values: Record<string, string>,
  context?: string,
): string {
  return SUBJECTS[kind](values, context);
}

/** The consent tick on `/contact`, which is the only form that carries one. */
export function needsConsent(kind: FormKind): boolean {
  return kind === "contact";
}
