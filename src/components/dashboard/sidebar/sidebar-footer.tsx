"use client";

import { LogOut } from "lucide-react";
import { useGetMe, useLogout } from "@/hooks";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar.store";

export function SidebarFooter() {
  const isOpen = useSidebarStore((s) => s.isOpen);
  const { data } = useGetMe();
  const { mutate: doLogout, isPending } = useLogout();
  const user = data?.data;

  if (!isOpen) {
    return (
      <div className="flex w-full flex-col items-center gap-3 px-2 pb-5">
        <span
          aria-hidden
          className="flex h-9 w-9 items-center justify-center rounded-full bg-lime/15 text-sm font-black text-lime"
        >
          {(user?.name ?? "Q").charAt(0).toUpperCase()}
        </span>
        <button
          type="button"
          disabled={isPending}
          onClick={() => doLogout()}
          aria-label="Logout"
          title="Logout"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-cream/70 transition-colors outline-none hover:bg-white/10 hover:text-cream focus-visible:ring-2 focus-visible:ring-lime disabled:opacity-50"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="mt-auto w-full border-t border-cream/10 p-4 text-sm">
      <p className="truncate font-bold text-cream">{user?.name}</p>
      <p className="truncate text-xs text-cream/50">{user?.email}</p>
      <p className="pill-tag mt-2 bg-lime/15 text-lime">{user?.role}</p>
      <button
        type="button"
        disabled={isPending}
        onClick={() => doLogout()}
        className={cn(
          "mt-3 inline-flex w-full cursor-pointer items-center gap-2 rounded-full border border-cream/20 px-4 py-2 text-sm font-bold text-cream/80 transition-colors outline-none hover:border-lime hover:text-lime focus-visible:ring-2 focus-visible:ring-lime disabled:opacity-50",
        )}
      >
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </div>
  );
}
