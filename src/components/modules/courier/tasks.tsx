"use client";

import { Card, ScrollShadow } from "@heroui/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { DELIVERY_STATUS_OPTIONS } from "@/components/modules/shipments/status-options";
import { Button } from "@/components/ui/button";
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
          <Card className="hero-card-scope w-full min-w-0 max-w-full overflow-hidden p-0">
            <ScrollShadow
              className="w-full max-w-full p-4"
              orientation="horizontal"
              hideScrollBar
            >
              <div className="flex w-max max-w-none flex-row gap-4">
                {["sk-a", "sk-b", "sk-c"].map((k) => (
                  <Skeleton
                    key={k}
                    className="h-28 w-[240px] max-w-[78vw] shrink-0"
                  />
                ))}
              </div>
            </ScrollShadow>
          </Card>
        ) : assigned.isError ? (
          <p className="mt-2 text-sm text-destructive">
            {getErrorMessage(assigned.error)}
          </p>
        ) : (assigned.data.data ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No active assignment — you are available for new jobs.
          </p>
        ) : (
          <Card className="hero-card-scope w-full min-w-0 max-w-full overflow-hidden p-0">
            <ScrollShadow
              className="w-full max-w-full p-4"
              orientation="horizontal"
              hideScrollBar
            >
              <div className="flex w-max max-w-none flex-row gap-4">
                {(assigned.data.data ?? []).map((d) => (
                  <Link
                    key={d.id}
                    href={`/courier/deliveries/${d.id}`}
                    className="min-w-0 shrink-0"
                  >
                    <Card
                      variant="transparent"
                      className="flex w-[250px] min-w-0 max-w-[78vw] flex-col justify-between gap-4 border border-border bg-card p-4 transition-colors hover:border-forest"
                    >
                      <div className="min-w-0">
                        <Card.Title className="truncate font-mono text-sm font-bold">
                          {d.shipment?.trackingNumber ?? d.shipmentId}
                        </Card.Title>
                        <Card.Description className="mt-0.5 truncate text-xs">
                          {d.shipment
                            ? `${d.shipment.origin} → ${d.shipment.destination}`
                            : "—"}
                        </Card.Description>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Assigned {new Date(d.assignedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <StatusBadge status={d.status} />
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </ScrollShadow>
          </Card>
        )}
      </div>

      {/* ——— Delivery history · vertical ScrollShadow + cursor Load More ——— */}
      <div className="grid w-full min-w-0 gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-semibold">Delivery history</h2>
            {!history.isPending && !history.isError ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                Showing {items.length} of {total}{" "}
                {total === 1 ? "delivery" : "deliveries"}
              </p>
            ) : null}
          </div>
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
            <Card className="hero-card-scope w-full min-w-0 max-w-full overflow-hidden p-0">
              <div className="hidden grid-cols-[140px_minmax(0,1fr)_auto_110px] items-center gap-4 bg-ink px-4 py-3 text-[11px] font-black uppercase tracking-[0.08em] text-lime sm:grid">
                <span>Shipment</span>
                <span>Route</span>
                <span>Status</span>
                <span className="text-right">Assigned</span>
              </div>
              <ScrollShadow
                className="max-h-[520px] w-full max-w-full p-4"
                orientation="vertical"
                hideScrollBar
              >
                <div className="grid min-w-0 gap-3">
                  {items.map((d) => (
                    <Card
                      key={d.id}
                      variant="transparent"
                      className="flex w-full min-w-0 flex-col gap-2 border border-border bg-card p-3 sm:grid sm:grid-cols-[130px_minmax(0,1fr)_auto_90px] sm:items-center sm:gap-3 lg:grid-cols-[140px_minmax(0,1fr)_auto_110px] lg:gap-4"
                    >
                      <Link
                        href={`/courier/deliveries/${d.id}`}
                        className="min-w-0 truncate font-mono text-sm font-semibold text-primary hover:underline"
                      >
                        {d.shipment?.trackingNumber ?? d.shipmentId.slice(0, 8)}
                      </Link>
                      <p className="min-w-0 truncate text-sm">
                        {d.shipment
                          ? `${d.shipment.origin} → ${d.shipment.destination}`
                          : "—"}
                      </p>
                      <div className="min-w-0 shrink-0">
                        <StatusBadge status={d.status} />
                      </div>
                      <p className="min-w-0 text-sm text-muted-foreground sm:text-right">
                        {new Date(d.assignedAt).toLocaleDateString()}
                      </p>
                    </Card>
                  ))}
                  {history.isFetchingNextPage
                    ? ["more-1", "more-2"].map((k) => (
                        <Skeleton key={k} className="h-[68px] w-full" />
                      ))
                    : null}
                </div>
              </ScrollShadow>
            </Card>
            <div className="flex flex-col items-center gap-2 pt-1">
              <p className="text-xs text-muted-foreground">
                Showing {items.length} of {total}
              </p>
              {history.hasNextPage ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => history.fetchNextPage()}
                  disabled={history.isFetchingNextPage}
                  className="min-w-40 bg-lime text-ink font-bold hover:bg-lime/90"
                >
                  {history.isFetchingNextPage ? "Loading…" : "Load more"}
                </Button>
              ) : (
                <p className="text-xs font-semibold text-muted-foreground">
                  You’ve reached the end.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
