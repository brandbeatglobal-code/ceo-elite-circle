import Link from "next/link";

const columns = [
  {
    heading: "The Circle",
    links: [
      { href: "/about", label: "About the Circle" },
      { href: "/pillars", label: "The Five Pillars" },
      { href: "/experiences", label: "Signature Experiences" },
      { href: "/councils", label: "Executive Councils" },
      { href: "/insights", label: "Insights" },
    ],
  },
  {
    heading: "Membership",
    links: [
      { href: "/membership", label: "Membership Categories" },
      { href: "/trust", label: "Trust Framework" },
      { href: "/contact", label: "Request Membership Consideration" },
    ],
  },
  {
    heading: "Begin",
    links: [{ href: "/contact", label: "Begin Your Membership Journey" }],
  },
];

export default function Footer() {
  return (
    <footer className="bg-cream text-ink border-t border-hair">
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-hair">
          <div className="py-12 lg:pr-10">
            <div className="text-lg font-semibold tracking-tight mb-5">
              CEO Elite Circle
            </div>
            <p className="type-lead max-w-xs">
              A private circle for distinguished business leaders.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading} className="py-12 lg:border-l border-hair lg:pl-8">
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
