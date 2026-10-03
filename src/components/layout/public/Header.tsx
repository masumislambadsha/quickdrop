"use client";

import { Menu, Package, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/track", label: "Track" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-lime/10 bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-2 px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime text-ink">
            <Package className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="display truncate text-xl text-cream">QuickDrop</span>
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
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-bold text-cream transition-colors hover:text-lime sm:block"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="btn-lime hidden !px-5 !py-2.5 !text-sm min-[420px]:inline-flex"
          >
            Book a shipment
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            className="rounded-full border border-cream/15 p-2 text-cream outline-none hover:border-lime/50 focus-visible:ring-2 focus-visible:ring-lime md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-cream/10 bg-ink px-4 pb-5 pt-3 md:hidden"
        >
          <ul className="grid gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-cream/85 transition-colors hover:bg-cream/5 hover:text-lime"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid gap-2">
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="btn-lime w-full !text-sm min-[420px]:hidden"
            >
              Book a shipment
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="w-full rounded-full border-2 border-lime px-5 py-2.5 text-center text-sm font-bold text-lime sm:hidden"
            >
              Login
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
