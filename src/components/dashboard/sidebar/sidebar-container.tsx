import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar.store";

export function SidebarContainer({ children }: { children: ReactNode }) {
  const isOpen = useSidebarStore((s) => s.isOpen);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col bg-ink text-cream shadow-xl rounded-r-xl transition-all duration-300",
        // Mobile: overlay drawer, full width when open, off-canvas when closed.
        "w-64",
        isOpen ? "translate-x-0" : "-translate-x-full",
        // Desktop: always visible icon rail, expands to full width.
        "md:translate-x-0",
        isOpen ? "md:w-64" : "md:w-16",
      )}
    >
      {children}
    </aside>
  );
}
