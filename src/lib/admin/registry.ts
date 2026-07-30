import fs from "node:fs";
import path from "node:path";

/**
 * The admin's view of the content — derived from the `content/` directory
 * itself, not hand-maintained. The section list is whatever JSON files exist;
 * their sections are the files' top-level keys; their fields are the values.
 * Adding a thirteenth content file makes it appear here without touching this
 * module. `KNOWN` below is display polish only — a file it does not know
 * still shows up, with a label derived from its filename.
 *
 * Phase 3's edit forms read these same shapes, so the navigation and the
 * forms cannot disagree about what exists.
 */
export type ContentFile = {
  /** Basename without extension — the admin URL segment. */
  name: string;
  fileName: string;
  label: string;
  /** Where on the site this file's content renders. */
  feeds: string;
  data: Record<string, unknown>;
  sectionCount: number;
  fieldCount: number;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

const KNOWN: Record<string, { label: string; feeds: string }> = {
  site: { label: "Site-wide", feeds: "Metadata, navigation, footer, draft banner" },
  forms: { label: "Closing forms", feeds: "The request section on every page" },
  homepage: { label: "Homepage", feeds: "/" },
  about: { label: "About the Circle", feeds: "/about" },
  pillars: { label: "The Five Pillars", feeds: "/pillars and each pillar page" },
  experiences: { label: "Signature Experiences", feeds: "/experiences and each experience page" },
  membership: { label: "Membership", feeds: "/membership, plus the homepage categories" },
  trust: { label: "Trust Framework", feeds: "/trust" },
  councils: { label: "Executive Councils", feeds: "/councils" },
  contact: { label: "Contact / Apply", feeds: "/contact" },
  insights: { label: "Insights", feeds: "/insights and the article template" },
  leadership: { label: "Leadership profiles", feeds: "The leadership profile template" },
};

/** Inventory order — one page per row, cross-page files first and last. */
const ORDER = [
  "site",
  "homepage",
  "about",
  "pillars",
  "experiences",
  "membership",
  "trust",
  "councils",
  "contact",
  "insights",
  "leadership",
  "forms",
];

/** Leaves are what an editor will eventually edit: strings and nulls. */
function countFields(value: unknown): number {
  if (value === null || typeof value !== "object") return 1;
  return Object.values(value).reduce<number>((n, v) => n + countFields(v), 0);
}

export function contentFile(name: string): ContentFile | null {
  // The name doubles as a URL segment; the pattern also keeps the path inside
  // the content directory.
  if (!/^[a-z][a-z-]*$/.test(name)) return null;
  const file = path.join(CONTENT_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return null;
  const data = JSON.parse(fs.readFileSync(file, "utf8")) as Record<
    string,
    unknown
  >;
  const known = KNOWN[name];
  return {
    name,
    fileName: `${name}.json`,
    label: known?.label ?? name.charAt(0).toUpperCase() + name.slice(1),
    feeds: known?.feeds ?? "—",
    data,
    sectionCount: Object.keys(data).length,
    fieldCount: countFields(data),
  };
}

export function listContentFiles(): ContentFile[] {
  const names = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.slice(0, -".json".length));
  names.sort((a, b) => {
    const ia = ORDER.indexOf(a);
    const ib = ORDER.indexOf(b);
    return (
      (ia === -1 ? ORDER.length : ia) - (ib === -1 ? ORDER.length : ib) ||
      a.localeCompare(b)
    );
  });
  return names
    .map((name) => contentFile(name))
    .filter((f): f is ContentFile => f !== null);
}

const ACRONYMS = new Set(["cta", "faq", "url", "aria"]);

/** "heroEyebrow" → "Hero eyebrow"; "ctaHref" → "CTA href". */
export function keyLabel(key: string): string {
  const words = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(" ")
    .map((w) => (ACRONYMS.has(w) ? w.toUpperCase() : w));
  const label = words.join(" ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}
