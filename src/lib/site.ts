import data from "../../content/site.json";

/**
 * Site-wide content: metadata, the nav, the footer and the draft notice.
 *
 * Every loader in this directory is deliberately thin — it imports one JSON
 * file, declares its type, and exports it. No defaulting, no merging, no
 * computation. Changing a value in `content/` changes the rendered page and
 * nothing else, which is what makes the Phase 2+ admin a file edit rather than
 * a code change.
 */
export type NavLink = { href: string; label: string };
export type LinkGroup = { heading: string; links: NavLink[] };

export type SiteContent = {
  brand: string;
  metadata: {
    title: string;
    description: string;
    /** Appended to a record's own name on the dynamic routes. */
    titleSuffix: string;
  };
  nav: {
    groups: LinkGroup[];
    cta: NavLink;
    menuLabel: string;
    closeLabel: string;
    menuAriaLabel: string;
  };
  footer: {
    tagline: string;
    columns: LinkGroup[];
    legal: { copyrightHolder: string; items: string[] };
  };
  draftBanner: { text: string; dismissLabel: string };
};

export const site: SiteContent = data;
