import Link from "next/link";

/* Mirrors the nav's three groups exactly, so the two never drift apart, plus
   the closing CTA column. */
const columns = [
  {
    heading: "The Circle",
    links: [
      { href: "/about", label: "About the Circle" },
      { href: "/pillars", label: "The Five Pillars" },
      { href: "/experiences", label: "Signature Experiences" },
    ],
  },
  {
    heading: "Membership",
    links: [
      { href: "/membership", label: "Membership" },
      { href: "/trust", label: "Trust Framework" },
      { href: "/councils", label: "Executive Councils" },
    ],
  },
  {
    heading: "Insights",
    links: [{ href: "/insights", label: "Insights" }],
  },
  {
    heading: "Begin",
    links: [{ href: "/contact", label: "Request Membership Consideration" }],
  },
];

export default function Footer() {
  return (
    <footer className="bg-cream text-ink border-t border-hair">
      <div className="wrap">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-b border-hair">
          <div className="py-16 lg:pr-10">
            <div className="text-lg font-semibold tracking-tight mb-5">
              CEO Elite Circle
            </div>
            <p className="type-lead max-w-xs">
              A private circle for distinguished business leaders.
            </p>
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
          <p className="type-label text-olive">
            © {new Date().getFullYear()} CEO Elite Circle
          </p>
          <p className="type-label text-olive md:border-l border-hair md:pl-8">
            All rights reserved
          </p>
          <p className="type-label text-olive md:border-l border-hair md:pl-8">
            Membership by consideration
          </p>
          <p className="type-label text-olive md:border-l border-hair md:pl-8">
            Private and confidential
          </p>
        </div>
      </div>
    </footer>
  );
}
