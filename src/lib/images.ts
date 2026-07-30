/**
 * The shape of every photographic slot on the site.
 *
 * Slots themselves live in `content/*.json`, on the page or the item they
 * belong to — there is no central register any more, because "which photo sits
 * on the About hero" is About's content rather than a global.
 *
 * `src` is a URL or a path under `/public`. A slot with `src: null` renders a
 * labelled "photography pending" frame instead of an image, so a missing photo
 * reads as deliberate rather than broken. Filling one is a one-line edit to
 * the JSON — through the admin from Phase 4, by hand until then.
 */
export type Photo = {
  src: string | null;
  alt: string;
  /** What this slot wants, for whoever fills it in. */
  note: string;
};
