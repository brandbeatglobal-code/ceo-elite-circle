import data from "../../content/forms.json";

/**
 * The closing-form variants — see `RequestSection`.
 *
 * `ctaHref` used to live here, and is gone. It made a variant's button a link
 * to `/contact`, and existed only because nothing on this section could send:
 * two variants pointed at the one page with a real form, and the rest rendered
 * a disabled button. Every variant sends now, so the button is a submit and
 * there is nowhere else for it to point.
 *
 * The field lists are still just labels. How each one behaves — required or
 * not, text or a real dropdown — is `src/lib/formSpec.ts`, which the renderer
 * and the server-side validator both read.
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
};

export const forms: Record<RequestVariant, FormConfig> = data;
