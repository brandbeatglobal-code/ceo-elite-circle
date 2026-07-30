import type { Photo } from "@/lib/images";
import data from "../../content/insights.json";

/**
 * Insights articles.
 *
 * There are no real articles yet. `articles` holds one structural template so
 * `/insights/[slug]` can be built and visited directly; `published` is what the
 * list page renders from, and it is deliberately empty. The list page shows
 * labelled "article pending" cards instead — present and on-system, but not
 * pretending to be posts.
 *
 * The template's four metadata fields stay null on purpose: an author, a
 * publisher and a date are verifiable claims, and this is not a published
 * article. Publishing a first real one means adding it to `articles` with every
 * field filled, then adding it to `published`.
 */
export type ArticleBody = {
  openingHeading: string;
  openingParagraphs: string[];
  listHeading: string;
  listIntro: string;
  listItems: string[];
  closingHeading: string;
  closingParagraphs: string[];
  note: string;
  pullQuote: string;
};

export type Article = {
  slug: string;
  title: string | null;
  photo: Photo;
  readingTime: string | null;
  author: string | null;
  publisher: string | null;
  date: string | null;
  body: ArticleBody;
};

export type InsightsContent = {
  page: {
    metaTitle: string;
    heroEyebrow: string;
    heroTitle: string;
    heroIntro: string;
    listEyebrow: string;
    listTitle: string;
    listIntro: string;
    pendingCardLabel: string;
    pendingCardPhotoNote: string;
    emptyNote: string;
  };
  detail: {
    fallbackMetaTitle: string;
    articleEyebrow: string;
    metaLabels: {
      readingTime: string;
      author: string;
      publisher: string;
      date: string;
    };
    pendingValue: string;
    noteLabel: string;
    relatedEyebrow: string;
    relatedTitle: string;
    relatedNote: string;
    relatedCardLabel: string;
    relatedCardPhotoNote: string;
  };
  articles: Article[];
  /** Real, publishable articles. Empty until a first post is written. */
  published: Article[];
};

export const insights: InsightsContent = data;
export const articles = insights.articles;
export const published = insights.published;

export function articleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}
