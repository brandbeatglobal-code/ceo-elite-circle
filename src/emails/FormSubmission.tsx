import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  render,
} from "@react-email/components";

/**
 * The notification email, for every form.
 *
 * One template, not nine — the same discipline as `formSpec.ts` and
 * `admin/schema.ts`. Everything that differs between forms arrives as props;
 * nothing here knows which form it is rendering beyond the label it was given.
 *
 * **This is the site's language, not a copy of its CSS.** Mail clients do not
 * load web fonts, most strip `<style>`, and Outlook renders through Word. So
 * Sora and Fraunces are not requested at all — a safe stack approximates them —
 * every rule is an inline style on a table (which is what the React Email
 * primitives compile to), and the layout survives having its CSS thrown away.
 *
 * Two deliberate departures from the site:
 *
 * - **Cream, never the dark ramp.** A business notification defaults to a light
 *   background in every client and under every reader's own light/dark setting.
 *   Forcing dark is a real risk of looking broken somewhere neither of us can
 *   test.
 * - **Sage is a rule, a bullet and a divider — never a fill.** That is the
 *   site's own palette rule (`docs/brief.md`), and it happens to be the safe
 *   choice too: a coloured block is what a client's dark mode inverts worst.
 */

/** Approximating Sora: a clean sans. Outlook falls to Arial, which is fine. */
const SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif';
/** Approximating Fraunces. Georgia is on effectively every client. */
const SERIF = 'Georgia, "Times New Roman", Times, serif';

const CREAM = "#f3f3f1";
const INK = "#3e4032";
const OLIVE = "#5f6153";
const SAGE = "#628c6c";
const HAIR = "#dcdcd6";

export type EmailField = { label: string; value: string };

export type FormSubmissionProps = {
  /** Which form this is, in words — "Membership request". */
  formLabel: string;
  /** The submission's own headline: the sender's name, or their address. */
  headline: string;
  fields: EmailField[];
  /** The pillar or experience the form was attached to, where there is one. */
  context?: { label: string; value: string };
  /** The page it was sent from. */
  page?: string;
};

const wrap: React.CSSProperties = {
  backgroundColor: CREAM,
  margin: 0,
  padding: "32px 0",
  fontFamily: SANS,
  color: INK,
};

const container: React.CSSProperties = {
  backgroundColor: CREAM,
  maxWidth: "600px",
  margin: "0 auto",
  padding: "0 32px",
};

/** A path reads as a path everywhere except at the root, where it reads as a slash. */
function pageName(page: string): string {
  return page === "/" ? "the homepage" : page;
}

const rule: React.CSSProperties = {
  borderColor: HAIR,
  borderWidth: "1px 0 0",
  borderStyle: "solid",
  margin: "0",
};

export function FormSubmission({
  formLabel,
  headline,
  fields,
  context,
  page,
}: FormSubmissionProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{`${formLabel} — ${headline}`}</Preview>
      <Body style={wrap}>
        <Container style={container}>
          {/* Wordmark. Small, the way it sits in the site's nav. */}
          <Section style={{ paddingBottom: "20px" }}>
            <Text
              style={{
                margin: 0,
                fontFamily: SANS,
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: INK,
              }}
            >
              CEO Elite Circle
            </Text>
          </Section>

          <Hr style={{ ...rule, borderTopColor: SAGE }} />

          {/* The site's own section-header convention: sage bullet, small
              uppercase label, wide tracking. */}
          <Section style={{ paddingTop: "22px" }}>
            <Text
              style={{
                margin: 0,
                fontFamily: SANS,
                fontSize: "11px",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.09em",
                color: OLIVE,
              }}
            >
              <span style={{ color: SAGE }}>•</span> {formLabel}
            </Text>

            {/* The one headline-style moment, and the one place the serif
                earns its contrast: who this came from. */}
            <Text
              style={{
                margin: "10px 0 0",
                fontFamily: SERIF,
                fontSize: "26px",
                lineHeight: 1.25,
                fontWeight: 400,
                color: INK,
                wordBreak: "break-word",
              }}
            >
              {headline}
            </Text>
          </Section>

          {context && (
            <Section style={{ paddingTop: "18px" }}>
              <Text
                style={{
                  margin: 0,
                  padding: "10px 14px",
                  borderLeft: `2px solid ${SAGE}`,
                  fontFamily: SANS,
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: INK,
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    color: OLIVE,
                  }}
                >
                  {context.label}
                </span>
                {context.value}
              </Text>
            </Section>
          )}

          {/* One row per answer, hairline-divided — the rhythm of the site's
              own field lists. */}
          <Section style={{ paddingTop: "26px" }}>
            {fields.map((f, i) => (
              <Section key={f.label} style={{ padding: 0 }}>
                {i > 0 && <Hr style={rule} />}
                <Text
                  style={{
                    margin: 0,
                    paddingTop: i > 0 ? "14px" : 0,
                    fontFamily: SANS,
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    color: OLIVE,
                  }}
                >
                  {f.label}
                </Text>
                <Text
                  style={{
                    margin: "4px 0 14px",
                    fontFamily: SANS,
                    fontSize: "15px",
                    lineHeight: 1.6,
                    color: INK,
                    wordBreak: "break-word",
                  }}
                >
                  {f.value}
                </Text>
              </Section>
            ))}
          </Section>

          <Hr style={rule} />

          <Section style={{ paddingTop: "18px", paddingBottom: "8px" }}>
            <Text
              style={{
                margin: 0,
                fontFamily: SANS,
                fontSize: "12px",
                lineHeight: 1.7,
                color: OLIVE,
              }}
            >
              Sent from the CEO Elite Circle website{page ? `, ${pageName(page)}` : ""}.
              Replying to this message reaches the sender directly.
            </Text>
            <Text
              style={{
                margin: "8px 0 0",
                fontFamily: SANS,
                fontSize: "12px",
                lineHeight: 1.7,
                color: OLIVE,
              }}
            >
              Nothing from this form is stored anywhere. This email is the only
              record of it.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/**
 * The plain-text half of the same message.
 *
 * Written from the same props rather than scraped out of the rendered HTML, so
 * the two cannot say different things — but it is deliberately not a
 * transcription of the layout. It is the content, cleanly laid out, which is
 * what a reader who prefers text is actually after.
 */
export function formSubmissionText({
  formLabel,
  headline,
  fields,
  context,
  page,
}: FormSubmissionProps): string {
  const lines = [
    "CEO ELITE CIRCLE",
    "",
    formLabel.toUpperCase(),
    headline,
    "",
    "—",
    "",
  ];
  if (context) lines.push(`${context.label}: ${context.value}`, "");
  for (const f of fields) lines.push(`${f.label}: ${f.value}`);
  lines.push(
    "",
    "—",
    "",
    `Sent from the CEO Elite Circle website${page ? `, ${pageName(page)}` : ""}.`,
    "Replying to this message reaches the sender directly.",
    "Nothing from this form is stored anywhere. This email is the only record of it.",
  );
  return lines.join("\n");
}

/** Both halves of the message, from one set of props. */
export async function renderFormSubmission(
  props: FormSubmissionProps,
): Promise<{ html: string; text: string }> {
  return {
    html: await render(<FormSubmission {...props} />),
    text: formSubmissionText(props),
  };
}

export default FormSubmission;
