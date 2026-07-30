import Link from "next/link";
import { site } from "@/lib/site";

/* Columns mirror the nav's three groups exactly, so the two never drift apart,
   plus the closing CTA column. Both live in `content/site.json`. */
const { tagline, columns, legal } = site.footer;

export default function Footer() {
  return (
    <footer className="bg-cream text-ink border-t border-hair">
      <div className="wrap">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-b border-hair">
          <div className="py-16 lg:pr-10">
            <div className="text-lg font-semibold tracking-tight mb-5">
              {site.brand}
            </div>
            <p className="type-lead max-w-xs">{tagline}</p>
          </div>

          {columns.map((col) => (
            <div key={col.heading} className="py-16 lg:border-l border-hair lg:pl-8">
              <div className="type-link text-ink mb-5">{col.heading}</div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="type-label text-olive hover:text-sage transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-3 py-6">
          {/* The year is computed, not content. */}
          <p className="type-label text-olive">
            © {new Date().getFullYear()} {legal.copyrightHolder}
          </p>
          {legal.items.map((item) => (
            <p
              key={item}
              className="type-label text-olive md:border-l border-hair md:pl-8"
            >
              {item}
            </p>
          ))}
        </div>
      </div>
    </footer>
  );
}
