import { Package } from "lucide-react";
import Link from "next/link";

const cols = [
  {
    title: "Ship",
    links: [
      { href: "/dashboard/shipments/new", label: "Book a shipment" },
      { href: "/pricing", label: "Pricing" },
      { href: "/track", label: "Track a parcel" },
      { href: "/services", label: "Services" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/login", label: "Login" },
      { href: "/register", label: "Register" },
    ],
  },
  {
    title: "Roles",
    links: [
      { href: "/dashboard", label: "Customer" },
      { href: "/courier", label: "Courier" },
      { href: "/admin", label: "Operations" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="overflow-hidden bg-ink pt-16">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 md:grid-cols-[1fr_2fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime text-ink">
              <Package className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="display text-xl text-cream">QuickDrop</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
            The courier and logistics platform for customers, couriers, and
            operations teams. Ship anything. Track everything.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {cols.map((c) => (
            <div key={c.title}>
              <p className="pill-tag bg-lime/15 text-lime">{c.title}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-cream/70 transition-colors hover:text-lime"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="display mt-12 text-center text-[clamp(56px,13vw,180px)] leading-none text-lime">
          QuickDrop
        </p>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-cream/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} QuickDrop — Courier & Logistics
            Platform
          </p>
          <p>Secure Stripe payments · Real-time tracking</p>
        </div>
      </div>
    </footer>
  );
}
