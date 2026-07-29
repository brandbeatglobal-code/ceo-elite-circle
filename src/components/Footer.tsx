import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-forest text-white mt-32">
      <div className="wrap py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="font-display text-2xl mb-3">CEO Elite Circle</div>
            <p className="text-sm text-white/70 max-w-xs">
              A private circle for distinguished business leaders.
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-gold-soft mb-4">
              The Circle
            </div>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/about">About the Circle</Link></li>
              <li><Link href="/pillars">The Five Pillars</Link></li>
              <li><Link href="/experiences">Signature Experiences</Link></li>
              <li><Link href="/councils">Executive Councils</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-gold-soft mb-4">
              Membership
            </div>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/membership">Membership Categories</Link></li>
              <li><Link href="/trust">Trust Framework</Link></li>
              <li><Link href="/contact">Request Membership Consideration</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-gold-soft mb-4">
              Begin
            </div>
            <Link
              href="/contact"
              className="inline-block border border-gold-soft text-gold-soft text-sm px-5 py-2 hover:bg-gold-soft hover:text-forest transition-colors"
            >
              Request Membership Consideration
            </Link>
          </div>
        </div>

        <div className="divider-gold my-10 opacity-60" />

        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} CEO Elite Circle. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
