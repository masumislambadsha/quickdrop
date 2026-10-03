"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar.store";

interface SidebarButtonProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  onNavigate?: () => void;
}

export function SidebarButton({
  href,
  icon,
  label,
  isActive = false,
  onNavigate,
}: SidebarButtonProps) {
  const isOpen = useSidebarStore((s) => s.isOpen);

  return (
    <Link
      href={href}
      title={label}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "flex h-11 w-full items-center rounded-full text-sm font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-lime",
        isOpen ? "gap-3 px-4" : "justify-center px-0",
        isActive
          ? "bg-lime text-ink"
          : "text-cream/70 hover:bg-white/10 hover:text-cream",
      )}
    >
      <span className="flex shrink-0 items-center justify-center">{icon}</span>
      {isOpen ? (
        <span className="truncate transition-opacity duration-100">
          {label}
        </span>
      ) : null}
    </Link>
  );
}
