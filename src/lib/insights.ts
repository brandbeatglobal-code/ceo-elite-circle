import type { Photo } from "@/lib/images";

/**
 * Insights articles.
 *
 * There are no real articles yet. `articles` holds one structural template so
 * `/insights/[slug]` can be built and visited directly; `published` is what the
 * list page renders from, and it is deliberately empty. The list page shows
 * labelled "article pending" cards instead — present and on-system, but not
 * pretending to be posts.
 *
 * Publishing the first real article means adding it here with every field
 * filled, then adding it to `published`.
 */
export type Article = {
  slug: string;
  title: string | null;
  photo: Photo;
  readingTime: string | null;
  author: string | null;
  publisher: string | null;
  date: string | null;
};

export const articles: Article[] = [
  {
    slug: "template",
    // Sample title and body, so the template reads as a page rather than a
    // skeleton. The metadata below stays null on purpose: an author, publisher
    // and date are verifiable claims, and this is not a published article.
    title: "The problem with good advice",
    photo: {
      src: null,
      alt: "",
      note: "the article's lead image, breaking the body copy.",
    },
    readingTime: null,
    author: null,
    publisher: null,
    date: null,
  },
];

/** Real, publishable articles. Empty until a first post is written. */
export const published: Article[] = [];

export function articleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}
