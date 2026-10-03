"use client";

import { Card, ScrollShadow } from "@heroui/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Reference-style data table: light gray rounded frame, muted uppercase
 * header with column dividers, white divider rows inside a vertical
 * ScrollShadow, and a footer with "Showing X of Y" + pill Load more.
 * Built on HeroUI Card + ScrollShadow.
 */
export function DataTableShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "w-full min-w-0 max-w-full gap-1 overflow-hidden rounded-[20px] border-0 bg-[#eceef1] p-1.5 shadow-none sm:p-2",
        className,
      )}
    >
      {children}
    </Card>
  );
}

export interface DataTableColumn {
  label: string;
  className?: string;
}

export function DataTableHeader({
  columns,
  gridClass,
}: {
  columns: DataTableColumn[];
  gridClass: string;
}) {
  return (
    <div
      className={cn(
        "hidden items-center gap-4 px-4 pt-1.5 pb-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500 sm:grid",
        gridClass,
      )}
    >
      {columns.map((c, i) => (
        <span
          key={c.label}
          className={cn(i > 0 && "border-l border-slate-300 pl-4", c.className)}
        >
          {c.label}
        </span>
      ))}
    </div>
  );
}

export function DataTableBody({
  children,
  maxH = "max-h-[520px]",
}: {
  children: ReactNode;
  maxH?: string;
}) {
  return (
    <ScrollShadow
      orientation="vertical"
      hideScrollBar
      className={cn("w-full max-w-full", maxH)}
    >
      <div className="grid min-w-0 gap-2">{children}</div>
    </ScrollShadow>
  );
}

export function DataTableRows({ children }: { children: ReactNode }) {
  return (
    <div className="divide-y divide-slate-100 rounded-[14px] bg-white">
      {children}
    </div>
  );
}

export function DataTableRow({
  children,
  gridClass,
  className,
}: {
  children: ReactNode;
  gridClass: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col gap-1 px-4 py-3.5 sm:grid sm:items-center sm:gap-4",
        gridClass,
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DataTableFooter({
  shown,
  total,
  hasNextPage,
  isLoading,
  onLoadMore,
  endText = "You've reached the end.",
}: {
  shown: number;
  total?: number | null;
  hasNextPage: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  endText?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-1">
      <p className="text-sm text-slate-500">
        Showing {shown}
        {total != null ? ` of ${total}` : ""}
      </p>
      {hasNextPage ? (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={isLoading}
          className="cursor-pointer rounded-full bg-slate-200/80 px-5 py-2 text-sm font-semibold text-slate-600 transition-colors outline-none hover:bg-slate-300 focus-visible:ring-2 focus-visible:ring-forest disabled:opacity-60"
        >
          {isLoading ? "Loading…" : "Load more"}
        </button>
      ) : (
        <p className="text-sm text-slate-400">{endText}</p>
      )}
    </div>
  );
}
