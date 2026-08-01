import "server-only";

/**
 * Sending a form submission as email, through Resend.
 *
 * **The API key never leaves the server.** This module is `server-only`, so
 * importing it from a client component is a build error rather than a leak —
 * the same rule `ADMIN_PASSWORD` and `GITHUB_TOKEN` live under. Every send goes
 * through the server action in `src/app/(site)/submit.ts`; nothing about a form
 * submission is sent from the browser to Resend.
 *
 * Plain `fetch` rather than the Resend SDK, deliberately. It keeps
 * `package.json` unchanged, and — the real reason — it lets `RESEND_API_BASE`
 * point the whole path at a local stand-in so the payloads can be verified
 * without a live key and without mail actually going anywhere. That is exactly
 * how `github.ts` is testable, and the technique has already caught real bugs
 * in this project.
 */

/**
 * Where every form currently lands.
 *
 * One address for all nine forms, and that is a consequence rather than a
 * decision: Resend has no verified sending domain for this project yet, so it
 * will only deliver to the account's own address whatever is configured.
 * Splitting this into per-form addresses once a domain exists is a change to
 * this constant and nothing else — which is why the subject lines below carry
 * the form's identity.
 */
export const FORM_RECIPIENT = "brandbeatglobal@gmail.com";

/**
 * Resend's shared sending domain. Replace with an address on the Circle's own
 * domain once one is verified; nothing else needs to change.
 */
export const FORM_SENDER = "CEO Elite Circle <onboarding@resend.dev>";

const API_BASE = process.env.RESEND_API_BASE ?? "https://api.resend.com";

export type SendResult = { ok: true; id: string } | { ok: false; error: string };

const NOT_CONFIGURED =
  "This form is not able to send yet: the site has no mail credentials set. Nothing has been sent, and nothing you typed has been stored.";
const UNREACHABLE =
  "The message could not be sent — the mail service could not be reached. Please try again in a moment, or email us directly.";

export function mailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendFormMail({
  subject,
  html,
  text,
  replyTo,
}: {
  subject: string;
  /** The designed half. See `src/emails/FormSubmission.tsx`. */
  html: string;
  /**
   * The same content as plain text. Sent alongside rather than instead of, so
   * the message goes out as multipart/alternative — better deliverability, and
   * some clients and screen readers would rather have the text.
   */
  text: string;
  /** The submitter's own address, so a reply goes straight back to them. */
  replyTo?: string;
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: NOT_CONFIGURED };

  try {
    const res = await fetch(`${API_BASE}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        from: FORM_SENDER,
        to: [FORM_RECIPIENT],
        subject,
        // Both, always. Resend sends them as multipart/alternative and the
        // reader's client picks.
        html,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        error:
          "The message could not be sent — the site's mail credentials were refused. Nothing has been sent.",
      };
    }
    if (!res.ok) {
      return {
        ok: false,
        error: `The message could not be sent (error ${res.status}). Nothing has been sent — please try again, or email us directly.`,
      };
    }

    const body = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: body.id ?? "sent" };
  } catch {
    return { ok: false, error: UNREACHABLE };
  }
}
