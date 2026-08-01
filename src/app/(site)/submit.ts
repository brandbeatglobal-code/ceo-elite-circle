"use server";

import { sendFormMail } from "@/lib/mail";
import {
  formFields,
  needsConsent,
  subjectFor,
  type FormKind,
} from "@/lib/formSpec";

/**
 * One server action for all nine forms.
 *
 * Everything here runs on the server: the Resend key is read inside
 * `sendFormMail`, which is `server-only`, so it cannot be pulled into a client
 * bundle even by accident.
 *
 * Nothing from the browser is trusted. The field list comes from `formSpec`,
 * not from the submitted form — a value under a name this form does not have
 * is ignored rather than forwarded, so the inbox cannot be used as a relay for
 * arbitrary text.
 */

export type SubmitState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      /**
       * What was typed, handed back so a refused submission does not cost the
       * visitor their answers. React resets an uncontrolled form once its
       * action completes, so without this a failure clears the form — which
       * asks someone to correct a field it has just emptied.
       */
      values: Record<string, string>;
      consent: boolean;
      /** Rises with each failure, so the fields remount carrying those values. */
      attempt: number;
    }
  | { status: "sent"; message: string };

/** Long enough for a real answer, short enough not to be a payload. */
const MAX_FIELD = 2_000;
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const CONTROL_ALL = new RegExp(CONTROL.source, "g");

/**
 * Deliberately loose. This is a gate against obvious junk in a shared inbox,
 * not an attempt to decide what a valid address is — that argument is
 * unwinnable and rejecting a real person's real address is the worse failure.
 */
function plausibleEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value) && value.length <= 254;
}

const KINDS = new Set<FormKind>([
  "membership",
  "application",
  "pillar",
  "experience",
  "governance",
  "council",
  "briefings",
  "enquiry",
  "contact",
]);

export async function submitForm(
  prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const consent = formData.get("consent") === "on";
  const attempt = (prev.status === "error" ? prev.attempt : 0) + 1;

  const kind = String(formData.get("kind") ?? "") as FormKind;
  if (!KINDS.has(kind)) {
    return {
      status: "error",
      message: "That form could not be identified. Please reload the page and try again.",
      values: {},
      consent,
      attempt,
    };
  }

  // The honeypot: a field positioned off-screen and hidden from assistive
  // technology, which a person never sees and therefore never fills. Anything
  // in it is automated. Answer as though it sent, so a bot learns nothing.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { status: "sent", message: SENT_MESSAGE };
  }

  const fields = formFields(kind);

  // Read everything first, so a refusal can hand all of it back rather than
  // only the fields checked before the one that failed.
  const values: Record<string, string> = {};
  for (const field of fields) {
    const raw = formData.get(field.label);
    const value = typeof raw === "string" ? raw.trim() : "";
    if (value !== "") values[field.label] = value;
  }

  /** Echoed to the browser, so it is capped and scrubbed like anything else. */
  const echo = (): Record<string, string> =>
    Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, v.slice(0, MAX_FIELD).replace(CONTROL_ALL, "")]),
    );
  const fail = (message: string): SubmitState => ({
    status: "error",
    message,
    values: echo(),
    consent,
    attempt,
  });

  for (const field of fields) {
    const value = values[field.label] ?? "";

    if (value.length > MAX_FIELD) {
      return fail(`“${field.label}” is too long. Please shorten it and try again.`);
    }
    if (CONTROL.test(value)) {
      return fail(`“${field.label}” contains characters that are not allowed.`);
    }
    if (field.required && value === "") {
      return fail(`“${field.label}” is required — please fill it in and send again.`);
    }
    if (field.kind === "email" && value !== "" && !plausibleEmail(value)) {
      return fail(`“${field.label}” does not look like an email address. Please check it and try again.`);
    }
    // A select may only carry one of the options it was actually offered.
    if (field.kind === "select" && value !== "" && !field.options?.includes(value)) {
      return fail(`“${field.label}” is not one of the available options.`);
    }
  }

  if (needsConsent(kind) && !consent) {
    return fail(
      "Please confirm you have read and agree to the privacy policy before sending.",
    );
  }

  const context = String(formData.get("context") ?? "").slice(0, 200).trim();
  const page = String(formData.get("page") ?? "").slice(0, 200).trim();

  const lines = [
    ...fields
      .filter((f) => values[f.label] !== undefined)
      .map((f) => `${f.label}: ${values[f.label]}`),
    "",
    "—",
    `Form: ${kind}`,
    ...(context ? [`Context: ${context}`] : []),
    ...(page ? [`Sent from: ${page}`] : []),
  ];

  const result = await sendFormMail({
    subject: subjectFor(kind, values, context || undefined),
    text: lines.join("\n"),
    replyTo: values.Email,
  });

  if (!result.ok) return fail(result.error);
  return { status: "sent", message: SENT_MESSAGE };
}

const SENT_MESSAGE =
  "Thank you — your message has been sent. Someone from the Circle will be in touch.";
