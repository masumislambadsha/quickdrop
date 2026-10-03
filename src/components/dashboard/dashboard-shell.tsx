"use client";

import { LogOut, Menu, Package } from "lucide-react";
import Link from "next/link";
import { useLogout } from "@/hooks";
import { cn } from "@/lib/utils";
import type { DashboardLink } from "@/routes";
import { useSidebarStore } from "@/store/sidebar.store";
import { Sidebar } from "./sidebar/sidebar";

export function DashboardShell({
  title,
  links,
  children,
}: {
  title: string;
  links: DashboardLink[];
  children: React.ReactNode;
}) {
  const isOpen = useSidebarStore((s) => s.isOpen);
  const toggle = useSidebarStore((s) => s.toggle);
  const { mutate: doLogout, isPending } = useLogout();

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar links={links} />

      {/* Mobile top bar — the sidebar is an overlay drawer below md. */}
      <div className="sticky top-0 z-20 flex items-center gap-3 bg-cream/90 px-4 py-3 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={toggle}
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          className="cursor-pointer rounded-full bg-ink p-2 text-cream outline-none focus-visible:ring-2 focus-visible:ring-forest"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime text-ink">
            <Package className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="display text-base text-ink">QuickDrop</span>
        </Link>
        <span className="flex-1" />
        <button
          type="button"
          disabled={isPending}
          onClick={() => doLogout()}
          aria-label="Logout"
          className="cursor-pointer rounded-full border border-ink/15 p-2 text-ink/70 outline-none hover:border-ink/40 focus-visible:ring-2 focus-visible:ring-forest disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* Padded for the fixed rail/drawer on desktop. */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-300",
          isOpen ? "md:pl-64" : "md:pl-16",
        )}
      >
        <div className="px-4 py-6 md:px-8">
          <h1 className="display text-3xl text-ink md:text-4xl">{title}</h1>
        </div>
        <main className="flex-1 p-4 pt-0 md:p-8 md:pt-0">{children}</main>
      </div>
    </div>
  );
}
