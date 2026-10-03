"use client";

import Link from "next/link";
import { SHIPMENT_STATUS_OPTIONS } from "@/components/modules/shipments/status-options";
import {
  DataTableBody,
  DataTableFooter,
  DataTableHeader,
  DataTableRow,
  DataTableRows,
  DataTableShell,
} from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { useDebounce, useListParams, useMyShipmentsInfinite } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { ShipmentStatus } from "@/types";

export const SHIPMENTS_GRID =
  "sm:grid-cols-[130px_minmax(0,1fr)_auto_auto_auto]";

export function MyShipmentsList() {
  const { params, setParams } = useListParams();
  const debouncedSearch = useDebounce(params.search, 500);
  const statusFilter = (params.status as ShipmentStatus) || undefined;

  const history = useMyShipmentsInfinite({
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
  });

  const items = history.data?.pages.flatMap((p) => p.data) ?? [];
  const total = history.data?.pages[0]?.meta?.total ?? 0;

  return (
    <div className="grid w-full min-w-0 gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Search tracking #, recipient, city..."
          value={params.search}
          onChange={(e) =>
            setParams({ search: e.target.value }, { resetPage: true })
          }
          className="sm:max-w-xs"
          aria-label="Search shipments"
        />
        <Select
          label="Filter by status"
          value={params.status}
          onChange={(v) => setParams({ status: v }, { resetPage: true })}
          options={SHIPMENT_STATUS_OPTIONS}
        />
      </div>

      {history.isPending ? (
        <div className="grid gap-2">
          {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"].map((k) => (
            <Skeleton key={k} className="h-12 w-full" />
          ))}
        </div>
      ) : history.isError ? (
        <p className="text-sm text-destructive">
          {getErrorMessage(history.error, "Failed to load shipments.")}
        </p>
      ) : items.length === 0 ? (
        <EmptyState
          title="No shipments found"
          description="Try adjusting your filters, or create a new shipment."
        />
      ) : (
        <>
          <DataTableShell>
            <DataTableHeader
              gridClass={SHIPMENTS_GRID}
              columns={[
                { label: "Tracking" },
                { label: "Route" },
                { label: "Status", className: "sm:justify-self-end" },
                { label: "Payment", className: "sm:justify-self-end" },
                { label: "Cost", className: "sm:text-right" },
              ]}
            />
            <DataTableBody>
              <DataTableRows>
                {items.map((s) => (
                  <DataTableRow key={s.id} gridClass={SHIPMENTS_GRID}>
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/shipments/${s.id}`}
                        className="block truncate font-mono text-[15px] font-medium text-slate-900 hover:underline"
                      >
                        {s.trackingNumber}
                      </Link>
                      <p className="truncate text-xs text-slate-500">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[15px] text-slate-900">
                        {s.origin} → {s.destination}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {s.recipientName}
                      </p>
                    </div>
                    <div className="min-w-0 shrink-0 sm:justify-self-end">
                      <StatusBadge status={s.status} />
                    </div>
                    <div className="min-w-0 shrink-0 sm:justify-self-end">
                      <StatusBadge status={s.paymentStatus} />
                    </div>
                    <p className="min-w-0 text-[15px] font-semibold text-slate-900 sm:text-right">
                      ${s.cost.toFixed(2)}
                    </p>
                  </DataTableRow>
                ))}
              </DataTableRows>
              {history.isFetchingNextPage ? (
                <div className="grid min-w-0 gap-2 pt-2">
                  {["more-1", "more-2"].map((k) => (
                    <Skeleton
                      key={k}
                      className="h-[68px] w-full rounded-[14px]"
                    />
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
      )}
    </div>
  );
}
