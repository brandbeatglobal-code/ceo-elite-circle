import data from "../../content/trust.json";

/**
 * The Trust Framework — **signed-off policy text, not copy.**
 *
 * For most of this project `content/trust.json` deliberately had no field for
 * an area's wording at all: each of the ten areas is a commitment a
 * prospective member could rely on, and draft text reads as binding whether or
 * not it is finished. The schema itself was the guardrail, so nothing could be
 * drafted here by accident or from the admin panel.
 *
 * That guardrail has been satisfied, not removed. The ten areas were signed
 * off by the founder and published; `body` exists now because there is
 * approved wording to put in it.
 *
 * What follows is a different rule rather than a weaker one: **an area's
 * wording changes only by the route it arrived through.** It is not tidied for
 * rhythm, not shortened to fit a layout, and not rephrased to match the voice
 * of the rest of the site. A member reads these as terms they are held to.
 */
export type TrustArea = {
  name: string;
  /** The signed-off wording. See the rule above before touching it. */
  body: string;
};

export type TrustContent = {
  metaTitle: string;
  hero: { eyebrow: string; title: string; intro: string };
  status: { eyebrow: string; title: string; lead: string; body: string };
  areas: {
    eyebrow: string;
    title: string;
    label: string;
    body: string;
    items: TrustArea[];
  };
};

export const trust: TrustContent = data;
