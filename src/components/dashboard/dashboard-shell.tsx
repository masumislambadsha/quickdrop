"use client";

import { LogOut, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetMe, useLogout } from "@/hooks";
import { cn } from "@/lib/utils";

export function DashboardShell({
  title,
  links,
  children,
}: {
  title: string;
  links: { label: string; href: string }[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data } = useGetMe();
  const { mutate: doLogout, isPending } = useLogout();
  const user = data?.data;

  // Highlight only the most specific matching link. A naive "exact OR prefix"
  // test marks every ancestor active at once, so /dashboard/shipments/new
  // lights up both "My Shipments" and "New Shipment". Picking the longest
  // match keeps parents active for detail pages (/shipments/<id>) while
  // letting a nested link win on its own page.
  const activeHref = links.reduce<string | null>((best, link) => {
    const isMatch =
      pathname === link.href || pathname.startsWith(`${link.href}/`);
    if (!isMatch) return best;
    return best === null || link.href.length > best.length ? link.href : best;
  }, null);

  return (
    <div className="min-h-screen bg-cream md:grid md:grid-cols-[260px_1fr]">
      <aside className="bg-ink text-cream">
        <div className="flex items-center justify-between px-4 py-4 md:flex-col md:items-stretch md:gap-6 md:p-6 md:min-h-screen">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime text-ink">
              <Package className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="display text-lg text-cream">QuickDrop</span>
          </Link>
          <nav className="flex gap-1.5 overflow-x-auto md:flex-col">
            {links.map((l) => {
              const active = l.href === activeHref;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-all",
                    active
                      ? "bg-lime text-ink"
                      : "text-cream/70 hover:bg-white/10 hover:text-cream",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="hidden md:block border-t border-cream/10 pt-4 text-sm md:mt-auto">
            <p className="truncate font-bold text-cream">{user?.name}</p>
            <p className="truncate text-xs text-cream/50">{user?.email}</p>
            <p className="pill-tag mt-2 bg-lime/15 text-lime">{user?.role}</p>
            <button
              type="button"
              disabled={isPending}
              onClick={() => doLogout()}
              className="mt-3 inline-flex w-full items-center gap-2 rounded-full border border-cream/20 px-4 py-2 text-sm font-bold text-cream/80 transition-colors hover:border-lime hover:text-lime disabled:opacity-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={() => doLogout()}
            className="md:hidden rounded-full border border-cream/20 p-2 text-cream/80"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>
      <div className="flex min-h-screen flex-col">
        <div className="px-4 py-6 md:px-8">
          <h1 className="display text-3xl text-ink md:text-4xl">{title}</h1>
        </div>
        <main className="flex-1 p-4 pt-0 md:p-8 md:pt-0">{children}</main>
      </div>
    </div>
  );
}
