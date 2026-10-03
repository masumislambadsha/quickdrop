"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { DashboardLink } from "@/routes";
import { useSidebarStore } from "@/store/sidebar.store";
import { SidebarButton } from "./sidebar-button";

function getActiveHref(
  links: DashboardLink[],
  pathname: string,
): string | null {
  // Highlight only the most specific matching link. A naive "exact OR prefix"
  // test marks every ancestor active at once, so /dashboard/shipments/new
  // lights up both "My Shipments" and "New Shipment". Picking the longest
  // match keeps parents active for detail pages (/shipments/<id>) while
  // letting a nested link win on its own page.
  return links.reduce<string | null>((best, link) => {
    const isMatch =
      pathname === link.href || pathname.startsWith(`${link.href}/`);
    if (!isMatch) return best;
    return best === null || link.href.length > best.length ? link.href : best;
  }, null);
}

export function SidebarNav({ links }: { links: DashboardLink[] }) {
  const pathname = usePathname();
  const isOpen = useSidebarStore((s) => s.isOpen);
  const close = useSidebarStore((s) => s.close);
  const activeHref = getActiveHref(links, pathname);

  return (
    <nav
      aria-label="Dashboard"
      className={cn(
        "flex w-full flex-1 flex-col gap-1.5 overflow-x-hidden overflow-y-auto py-4 touch-pan-y",
        isOpen ? "px-3" : "items-center px-2",
      )}
    >
      {links.map((l) => {
        const Icon = l.icon;
        return (
          <SidebarButton
            key={l.href}
            href={l.href}
            label={l.label}
            isActive={l.href === activeHref}
            icon={<Icon className="h-5 w-5" strokeWidth={2.25} />}
            onNavigate={() => {
              // On mobile the sidebar is an overlay drawer — dismiss it.
              // On desktop it is a persistent rail, so leave it open.
              if (window.innerWidth < 768) close();
            }}
          />
        );
      })}
    </nav>
  );
}
