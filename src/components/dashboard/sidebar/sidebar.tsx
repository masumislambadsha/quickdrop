"use client";

import type { DashboardLink } from "@/routes";
import { useSidebarStore } from "@/store/sidebar.store";
import { SidebarContainer } from "./sidebar-container";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarHeader } from "./sidebar-header";
import { SidebarNav } from "./sidebar-nav";

export function Sidebar({ links }: { links: DashboardLink[] }) {
  const isOpen = useSidebarStore((s) => s.isOpen);
  const close = useSidebarStore((s) => s.close);

  return (
    <>
      {isOpen ? (
        <div
          aria-hidden
          onClick={close}
          className="fixed inset-0 z-30 bg-ink/60 md:hidden"
        />
      ) : null}
      <SidebarContainer>
        <SidebarHeader />
        <SidebarNav links={links} />
        <SidebarFooter />
      </SidebarContainer>
    </>
  );
}
