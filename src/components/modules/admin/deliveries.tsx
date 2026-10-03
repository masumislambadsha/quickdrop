"use client";

import Link from "next/link";
import {
  DataTableBody,
  DataTableFooter,
  DataTableHeader,
  DataTableRow,
  DataTableRows,
  DataTableShell,
} from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAllShipmentsInfinite } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";

const DELIVERIES_GRID = "sm:grid-cols-[150px_minmax(0,1fr)_auto_auto]";

export function AdminDeliveries() {
  const history = useAllShipmentsInfinite({ hasDelivery: true });

  const items = history.data?.pages.flatMap((p) => p.data) ?? [];
  const total = history.data?.pages[0]?.meta?.total ?? 0;

  if (history.isPending) {
    return (
      <div className="grid gap-2">
        {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6", "sk-7", "sk-8"]
          .slice(0, 8)
          .map((k) => (
            <Skeleton key={k} className="h-12 w-full" />
          ))}
      </div>
    );
  }
  if (history.isError)
    return (
      <p className="text-sm text-destructive">
        {getErrorMessage(history.error)}
      </p>
    );

  if (items.length === 0) {
    return (
      <EmptyState
        title="No deliveries yet"
        description="Assign a courier from a shipment to create a delivery."
      />
    );
  }

  return (
    <>
      <DataTableShell>
        <DataTableHeader
          gridClass={DELIVERIES_GRID}
          columns={[
            { label: "Shipment" },
            { label: "Route" },
            { label: "Delivery status", className: "sm:justify-self-end" },
            { label: "Shipment status", className: "sm:justify-self-end" },
          ]}
        />
        <DataTableBody>
          <DataTableRows>
            {items.map((s) => (
              <DataTableRow key={s.id} gridClass={DELIVERIES_GRID}>
                <div className="min-w-0">
                  <Link
                    href={`/admin/shipments/${s.id}`}
                    className="block truncate text-[15px] font-medium text-slate-900 hover:underline"
                  >
                    {s.trackingNumber}
                  </Link>
                  <p className="truncate text-xs text-slate-500">
                    {s.recipientName}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[15px] text-slate-900">
                    {s.origin} → {s.destination}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {s.packageType} · {s.weightKg}kg
                  </p>
                </div>
                <div className="min-w-0 shrink-0 sm:justify-self-end">
                  {s.delivery ? (
                    <StatusBadge status={s.delivery.status as "ASSIGNED"} />
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
                  )}
                </div>
                <div className="min-w-0 shrink-0 sm:justify-self-end">
                  <StatusBadge status={s.status} />
                </div>
              </DataTableRow>
            ))}
          </DataTableRows>
          {history.isFetchingNextPage ? (
            <div className="grid min-w-0 gap-2 pt-2">
              {["more-1", "more-2"].map((k) => (
                <Skeleton key={k} className="h-[68px] w-full rounded-[14px]" />
              ))}
            </div>
          ) : null}
        </DataTableBody>
      </DataTableShell>
      <DataTableFooter
        shown={items.length}
        total={total}
        hasNextPage={history.hasNextPage}
        isLoading={history.isFetchingNextPage}
        onLoadMore={() => history.fetchNextPage()}
      />
    </>
  );
}
