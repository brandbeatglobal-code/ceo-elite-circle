import type { Photo } from "@/lib/images";
import data from "../../content/insights.json";

/**
 * Insights articles.
 *
 * `articles` holds every article the site can render, the structural template
 * included, and is what `/insights/[slug]` generates routes from. `published`
 * is the list of slugs the index actually links, and is what makes an article
 * public: the template is in `articles` and not in `published`, which is
 * exactly why it is reachable directly and linked from nowhere.
 *
 * Slugs rather than a second copy of each article, deliberately. The two lists
 * would otherwise hold the same body twice and could drift — and the admin
 * edits one field at a time, so it would only ever fix one of them.
 *
 * An article's metadata fields are verifiable claims. On the template they are
 * all null and render as "pending", which is honest for something that was
 * never published. On a published article a null is simply not shown: a real
 * post whose author says "pending" reads as broken rather than as unattributed.
 */
export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  /** A bulleted list beneath the paragraphs. Most sections carry none. */
  listItems: string[] | null;
};

export type ArticleBody = {
  /**
   * The article, in order. A list rather than named slots because the shape of
   * a piece is the writer's, not the template's — the first real article ran
   * to four prose sections and no bulleted list, which the previous fixed
   * opening/list/closing schema could not carry without inventing bullets.
   */
  sections: ArticleSection[];
  /** Side-note callout. Null where the piece came without one. */
  note: string | null;
  /** Closing statement, set large. Null where the piece came without one. */
  pullQuote: string | null;
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
    cardLinkLabel: string;
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
  /** Slugs of the articles the index links. Empty means nothing is published. */
  published: string[];
};

export const insights: InsightsContent = data;
export const articles = insights.articles;

export function articleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}

/** The published articles themselves, in the order `published` lists them. */
export const published: Article[] = insights.published
  .map(articleBySlug)
  .filter((a): a is Article => a !== undefined);

export function isPublished(slug: string) {
  return insights.published.includes(slug);
}
