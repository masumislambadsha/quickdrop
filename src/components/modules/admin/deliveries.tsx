"use client";

import { Card, ScrollShadow } from "@heroui/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAllShipmentsInfinite } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";

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
      <p className="text-xs text-muted-foreground">
        Showing {items.length} of {total}{" "}
        {total === 1 ? "delivery" : "deliveries"}
      </p>
      <Card className="hero-card-scope w-full min-w-0 max-w-full overflow-hidden p-0">
        <div className="hidden grid-cols-[140px_minmax(0,1fr)_auto_auto] items-center gap-4 bg-ink px-4 py-3 text-[11px] font-black uppercase tracking-[0.08em] text-lime sm:grid">
          <span>Shipment</span>
          <span>Route</span>
          <span>Delivery status</span>
          <span className="text-right">Shipment status</span>
        </div>
        <ScrollShadow
          className="max-h-[620px] w-full max-w-full p-4"
          orientation="vertical"
          hideScrollBar
        >
          <div className="grid min-w-0 gap-3">
            {items.map((s) => (
              <Card
                key={s.id}
                variant="transparent"
                className="flex w-full min-w-0 flex-col gap-2 border border-border bg-card p-3 sm:grid sm:grid-cols-[130px_minmax(0,1fr)_auto_auto] sm:items-center sm:gap-3 lg:grid-cols-[140px_minmax(0,1fr)_auto_auto] lg:gap-4"
              >
                <Link
                  href={`/admin/shipments/${s.id}`}
                  className="min-w-0 truncate font-mono text-sm font-semibold text-primary hover:underline"
                >
                  {s.trackingNumber}
                </Link>
                <p className="min-w-0 truncate text-sm">
                  {s.origin} → {s.destination}
                </p>
                <div className="min-w-0 shrink-0">
                  {s.delivery ? (
                    <StatusBadge status={s.delivery.status as "ASSIGNED"} />
                  ) : (
                    "—"
                  )}
                </div>
                <div className="min-w-0 shrink-0 sm:text-right">
                  <StatusBadge status={s.status} />
                </div>
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
            className="min-w-40"
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
  );
}
