"use client";

import { LayoutDashboard, LogOut, Menu, Package, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useGetMe, useLogout } from "@/hooks";
import { useAuthStore } from "@/store/auth.store";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/track", label: "Track" },
  { href: "/contact", label: "Contact" },
];

function roleHome(role?: string): string {
  if (role === "ADMIN") return "/admin";
  if (role === "COURIER") return "/courier";
  return "/dashboard";
}

function roleProfile(role?: string): string {
  if (role === "COURIER") return "/courier/profile";
  if (role === "ADMIN") return "/admin/profile";
  return "/dashboard/profile";
}

export function Header() {
  const [open, setOpen] = useState(false);
  const hasTokens = useAuthStore((s) => !!s.accessToken);
  const { data, isPending } = useGetMe(hasTokens);
  const { mutate: doLogout, isPending: isLoggingOut } = useLogout();
  const user = hasTokens ? data?.data : undefined;
  const checking = hasTokens && (isPending || !user);
  const home = roleHome(user?.role);
  const profile = roleProfile(user?.role);
  const firstName = user?.name?.split(" ")[0] ?? "Account";
  const initial = (user?.name ?? "Q").charAt(0).toUpperCase();

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-lime/10 bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-2 px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2"
          onClick={close}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime text-ink">
            <Package className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="display truncate text-xl text-cream">
            QuickDrop
          </span>
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
          {checking ? (
            <span
              aria-hidden
              className="h-10 w-28 animate-pulse rounded-full bg-cream/10"
            />
          ) : user ? (
            <>
              <Link
                href={profile}
                title="View profile"
                className="flex min-w-0 items-center gap-2 rounded-full border border-cream/15 py-1 pr-3 pl-1 transition-colors hover:border-lime/50"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime text-sm font-black text-ink">
                  {initial}
                </span>
                <span className="hidden max-w-24 truncate text-sm font-bold text-cream min-[420px]:block">
                  {firstName}
                </span>
              </Link>
              <Link
                href={home}
                className="btn-lime hidden !px-5 !py-2.5 !text-sm sm:inline-flex"
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => doLogout()}
                aria-label="Logout"
                title="Logout"
                className="rounded-full border border-cream/15 p-2 text-cream/80 outline-none transition-colors hover:border-lime/50 hover:text-lime focus-visible:ring-2 focus-visible:ring-lime disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
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
          {user ? (
            <Link
              href={profile}
              onClick={close}
              className="mb-2 flex items-center gap-3 rounded-2xl bg-cream/5 p-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime text-base font-black text-ink">
                {initial}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-cream">
                  {user.name}
                </span>
                <span className="block truncate text-xs text-cream/50">
                  {user.email}
                </span>
              </span>
              <span className="pill-tag ml-auto shrink-0 bg-lime/15 text-lime">
                {user.role}
              </span>
            </Link>
          ) : null}
          <ul className="grid gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={close}
                  className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-cream/85 transition-colors hover:bg-cream/5 hover:text-lime"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid gap-2">
            {user ? (
              <>
                <Link
                  href={home}
                  onClick={close}
                  className="btn-lime w-full !text-sm"
                >
                  <LayoutDashboard className="h-4 w-4" /> Go to dashboard
                </Link>
                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={() => {
                    close();
                    doLogout();
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-cream/20 px-5 py-2.5 text-sm font-bold text-cream/80 disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  onClick={close}
                  className="btn-lime w-full !text-sm min-[420px]:hidden"
                >
                  Book a shipment
                </Link>
                <Link
                  href="/login"
                  onClick={close}
                  className="w-full rounded-full border-2 border-lime px-5 py-2.5 text-center text-sm font-bold text-lime sm:hidden"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
