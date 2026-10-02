"use client";

import { Card, ScrollShadow } from "@heroui/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PaginationControls } from "@/components/modules/shipments/shipment-table";
import { DELIVERY_STATUS_OPTIONS } from "@/components/modules/shipments/status-options";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAssignedDeliveries, useListParams, useMyDeliveries } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { DeliveryStatus } from "@/types";

export function CourierTasks() {
  const { params, setParams } = useListParams();
  const assigned = useAssignedDeliveries();
  const mine = useMyDeliveries({
    page: params.page,
    limit: 10,
    status: (params.status as DeliveryStatus) || undefined,
  });

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
          <Card className="hero-card-scope w-full p-0">
            <ScrollShadow
              className="p-4"
              orientation="horizontal"
              hideScrollBar
            >
              <div className="flex flex-row gap-4">
                {["sk-a", "sk-b", "sk-c"].map((k) => (
                  <Skeleton key={k} className="h-28 w-[260px] shrink-0" />
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
          <Card className="hero-card-scope w-full p-0">
            <ScrollShadow
              className="p-4"
              orientation="horizontal"
              hideScrollBar
            >
              <div className="flex flex-row gap-4">
                {(assigned.data.data ?? []).map((d) => (
                  <Link
                    key={d.id}
                    href={`/courier/deliveries/${d.id}`}
                    className="shrink-0"
                  >
                    <Card
                      variant="transparent"
                      className="flex min-w-[250px] max-w-[280px] flex-col justify-between gap-4 border border-border bg-card p-4 transition-colors hover:border-forest"
                    >
                      <div className="min-w-0">
                        <Card.Title className="font-mono text-sm font-bold">
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

      {/* ——— Delivery history · vertical ScrollShadow ——— */}
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Delivery history</h2>
          <Select
            label="Filter by delivery status"
            value={params.status}
            onChange={(v) => setParams({ status: v }, { resetPage: true })}
            options={DELIVERY_STATUS_OPTIONS}
          />
        </div>
        {mine.isPending ? (
          <div className="grid gap-2">
            {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6", "sk-7", "sk-8"]
              .slice(0, 5)
              .map((k) => (
                <Skeleton key={k} className="h-12 w-full" />
              ))}
          </div>
        ) : mine.isError ? (
          <p className="text-sm text-destructive">
            {getErrorMessage(mine.error)}
          </p>
        ) : (mine.data.data ?? []).length === 0 ? (
          <EmptyState
            title="No deliveries found"
            description="Assigned jobs will appear here."
          />
        ) : (
          <>
            <Card className="hero-card-scope w-full overflow-hidden p-0">
              <div className="hidden grid-cols-[140px_minmax(0,1fr)_auto_110px] items-center gap-4 bg-ink px-4 py-3 text-[11px] font-black uppercase tracking-[0.08em] text-lime sm:grid">
                <span>Shipment</span>
                <span>Route</span>
                <span>Status</span>
                <span className="text-right">Assigned</span>
              </div>
              <ScrollShadow
                className="max-h-[520px] p-4"
                orientation="vertical"
                hideScrollBar
              >
                <div className="space-y-3">
                  {(mine.data.data ?? []).map((d) => (
                    <Card
                      key={d.id}
                      variant="transparent"
                      className="flex-col gap-3 border border-border bg-card p-3 sm:grid sm:grid-cols-[140px_minmax(0,1fr)_auto_110px] sm:items-center sm:gap-4 sm:p-3"
                    >
                      <Link
                        href={`/courier/deliveries/${d.id}`}
                        className="font-mono text-sm font-semibold text-primary hover:underline"
                      >
                        {d.shipment?.trackingNumber ?? d.shipmentId.slice(0, 8)}
                      </Link>
                      <p className="truncate text-sm">
                        {d.shipment
                          ? `${d.shipment.origin} → ${d.shipment.destination}`
                          : "—"}
                      </p>
                      <div className="shrink-0">
                        <StatusBadge status={d.status} />
                      </div>
                      <p className="text-sm text-muted-foreground sm:text-right">
                        {new Date(d.assignedAt).toLocaleDateString()}
                      </p>
                    </Card>
                  ))}
                </div>
              </ScrollShadow>
            </Card>
            <PaginationControls
              meta={mine.data.meta}
              onPage={(page) => setParams({ page })}
            />
          </>
        )}
      </div>
    </div>
  );
}
