import { Package } from "lucide-react";
import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/track", label: "Track" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-lime/10 bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime text-ink">
            <Package className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="display text-xl text-cream">QuickDrop</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-cream/80 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-lime"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-bold text-cream transition-colors hover:text-lime sm:block"
          >
            Login
          </Link>
          <Link href="/register" className="btn-lime !px-5 !py-2.5 !text-sm">
            Book a shipment
          </Link>
        </div>
      </div>
    </header>
  );
}
