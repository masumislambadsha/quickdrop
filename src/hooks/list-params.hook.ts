"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export interface ListParams {
  page: number;
  search: string;
  status: string;
}

/**
 * URL-synced list state: ?page=&search=&status= — shareable and bookmarkable.
 */
export function useListParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params: ListParams = useMemo(
    () => ({
      page: Math.max(1, Number(searchParams.get("page")) || 1),
      search: searchParams.get("search") ?? "",
      status: searchParams.get("status") ?? "",
    }),
    [searchParams],
  );

  const setParams = useCallback(
    (patch: Partial<ListParams>, opts?: { resetPage?: boolean }) => {
      const next = new URLSearchParams(searchParams.toString());
      const merged: ListParams = {
        page: patch.page ?? (opts?.resetPage ? 1 : params.page),
        search: patch.search ?? params.search,
        status: patch.status ?? params.status,
      };
      if (opts?.resetPage && patch.page === undefined) merged.page = 1;
      next.set("page", String(merged.page));
      if (merged.search) next.set("search", merged.search);
      else next.delete("search");
      if (merged.status) next.set("status", merged.status);
      else next.delete("status");
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams, params],
  );

  return { params, setParams };
}
