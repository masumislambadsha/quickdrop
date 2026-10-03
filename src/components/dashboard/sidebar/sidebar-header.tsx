import { ChevronsLeft, ChevronsRight, Package } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar.store";

export function SidebarHeader() {
  const isOpen = useSidebarStore((s) => s.isOpen);
  const toggle = useSidebarStore((s) => s.toggle);
  const close = useSidebarStore((s) => s.close);

  if (!isOpen) {
    return (
      <div className="flex w-full flex-col items-center gap-2 px-2 pt-4 pb-2">
        <Link
          href="/"
          aria-label="Go to homepage"
          onClick={close}
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-lime"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime text-ink">
            <Package className="h-5 w-5" strokeWidth={2.5} />
          </span>
        </Link>
        <button
          type="button"
          onClick={toggle}
          aria-label="Expand sidebar"
          aria-expanded={isOpen}
          className="cursor-pointer rounded-full p-1.5 text-cream/60 transition-colors outline-none hover:bg-white/10 hover:text-cream focus-visible:ring-2 focus-visible:ring-lime"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-between px-4 pt-4 pb-2">
      <Link
        href="/"
        aria-label="Go to homepage"
        onClick={close}
        className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-lime"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime text-ink">
          <Package className="h-5 w-5" strokeWidth={2.5} />
        </span>
        <span className="display text-lg text-cream">QuickDrop</span>
      </Link>
      <button
        type="button"
        onClick={toggle}
        aria-label="Collapse sidebar"
        aria-expanded={isOpen}
        className={cn(
          "cursor-pointer rounded-full p-1.5 text-cream/60 transition-colors outline-none",
          "hover:bg-white/10 hover:text-cream focus-visible:ring-2 focus-visible:ring-lime",
        )}
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>
    </div>
  );
}
