"use client";

import { Card, ScrollShadow } from "@heroui/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { DELIVERY_STATUS_OPTIONS } from "@/components/modules/shipments/status-options";
import {
  DataTableBody,
  DataTableFooter,
  DataTableHeader,
  DataTableRow,
  DataTableRows,
  DataTableShell,
} from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  useAssignedDeliveries,
  useListParams,
  useMyDeliveriesInfinite,
} from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { DeliveryStatus } from "@/types";

const HISTORY_GRID = "sm:grid-cols-[150px_minmax(0,1fr)_auto_110px]";

export function CourierTasks() {
  const { params, setParams } = useListParams();
  const assigned = useAssignedDeliveries();
  const statusFilter = (params.status as DeliveryStatus) || undefined;
  const history = useMyDeliveriesInfinite(statusFilter);

  const items = history.data?.pages.flatMap((p) => p.data) ?? [];
  const total = history.data?.pages[0]?.meta?.total ?? 0;

  return (
    <div className="grid w-full min-w-0 gap-6">
      {/* ——— Currently assigned · horizontal ScrollShadow ——— */}
      <div className="w-full min-w-0">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="font-semibold">Currently assigned</h2>
          {!assigned.isPending && !assigned.isError ? (
            <p className="text-xs text-muted-foreground">
              {(assigned.data?.data ?? []).length} active
            </p>
          ) : null}
        </div>
        {assigned.isPending ? (
          <DataTableShell>
            <div className="flex flex-row gap-2 overflow-hidden p-1">
              {["sk-a", "sk-b", "sk-c"].map((k) => (
                <Skeleton
                  key={k}
                  className="h-28 w-[240px] max-w-[78vw] shrink-0 rounded-2xl"
                />
              ))}
            </div>
          </DataTableShell>
        ) : assigned.isError ? (
          <p className="mt-2 text-sm text-destructive">
            {getErrorMessage(assigned.error)}
          </p>
        ) : (assigned.data.data ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No active assignment — you are available for new jobs.
          </p>
        ) : (
          <DataTableShell>
            <ScrollShadow
              className="w-full max-w-full p-1"
              orientation="horizontal"
              hideScrollBar
            >
              <div className="flex w-max max-w-none flex-row gap-2">
                {(assigned.data.data ?? []).map((d) => (
                  <Link
                    key={d.id}
                    href={`/courier/deliveries/${d.id}`}
                    className="min-w-0 shrink-0"
                  >
                    <Card
                      variant="transparent"
                      className="flex w-[250px] min-w-0 max-w-[78vw] flex-col justify-between gap-4 rounded-2xl bg-white p-4 transition-shadow hover:shadow-md"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-medium text-slate-900">
                          {d.shipment?.trackingNumber ?? d.shipmentId}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {d.shipment
                            ? `${d.shipment.origin} → ${d.shipment.destination}`
                            : "—"}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          Assigned {new Date(d.assignedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <StatusBadge status={d.status} />
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </ScrollShadow>
          </DataTableShell>
        )}
      </div>

      {/* ——— Delivery history · reference-style table + cursor Load More ——— */}
      <div className="grid w-full min-w-0 gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Delivery history</h2>
          <Select
            label="Filter by delivery status"
            value={params.status}
            onChange={(v) => setParams({ status: v }, { resetPage: true })}
            options={DELIVERY_STATUS_OPTIONS}
          />
        </div>
        {history.isPending ? (
          <div className="grid gap-2">
            {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6", "sk-7", "sk-8"]
              .slice(0, 5)
              .map((k) => (
                <Skeleton key={k} className="h-12 w-full" />
              ))}
          </div>
        ) : history.isError ? (
          <p className="text-sm text-destructive">
            {getErrorMessage(history.error)}
          </p>
        ) : items.length === 0 ? (
          <EmptyState
            title="No deliveries found"
            description="Assigned jobs will appear here."
          />
        ) : (
          <>
            <DataTableShell>
              <DataTableHeader
                gridClass={HISTORY_GRID}
                columns={[
                  { label: "Shipment" },
                  { label: "Route" },
                  { label: "Status", className: "sm:justify-self-end" },
                  { label: "Assigned", className: "sm:text-right" },
                ]}
              />
              <DataTableBody>
                <DataTableRows>
                  {items.map((d) => (
                    <DataTableRow key={d.id} gridClass={HISTORY_GRID}>
                      <div className="min-w-0">
                        <Link
                          href={`/courier/deliveries/${d.id}`}
                          className="block truncate text-[15px] font-medium text-slate-900 hover:underline"
                        >
                          {d.shipment?.trackingNumber ??
                            d.shipmentId.slice(0, 8)}
                        </Link>
                        <p className="truncate text-xs text-slate-500">
                          {d.shipment?.recipientName ?? "—"}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[15px] text-slate-900">
                          {d.shipment
                            ? `${d.shipment.origin} → ${d.shipment.destination}`
                            : "—"}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {d.shipment
                            ? `${d.shipment.packageType} · ${d.shipment.weightKg}kg`
                            : ""}
                        </p>
                      </div>
                      <div className="min-w-0 shrink-0 sm:justify-self-end">
                        <StatusBadge status={d.status} />
                      </div>
                      <p className="min-w-0 text-sm text-slate-600 sm:text-right">
                        {new Date(d.assignedAt).toLocaleDateString()}
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
    </div>
  );
}
