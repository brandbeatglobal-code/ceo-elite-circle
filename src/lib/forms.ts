import data from "../../content/forms.json";

/**
 * The closing-form variants — see `RequestSection`.
 *
 * `ctaHref` is set only where the destination does what the label promises.
 * Without it the button renders disabled, the same way the fields do. That is
 * the one field here worth guarding: a disabled control is visibly unfinished,
 * whereas a working button that navigates somewhere other than what it offered
 * gives no such signal.
 */
export type RequestVariant =
  | "membership"
  | "application"
  | "pillar"
  | "experience"
  | "governance"
  | "council"
  | "briefings"
  | "enquiry";

export type FormColumn = {
  legend: string;
  inputs?: string[];
  selects?: string[];
};

export type FormConfig = {
  eyebrow: string;
  heading: string;
  lead: string;
  body: string;
  columns: FormColumn[];
  note: string;
  cta: string;
  ctaHref?: string;
};

export const forms: Record<RequestVariant, FormConfig> = data;
