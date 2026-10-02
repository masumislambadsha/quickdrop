"use client";

import { Card, ScrollShadow } from "@heroui/react";
import { PaginationControls } from "@/components/modules/shipments/shipment-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { useListParams, useMyShipments } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";

export function CustomerPayments() {
  const { params, setParams } = useListParams();
  const { data, isPending, isError, error } = useMyShipments({
    page: params.page,
    limit: 10,
  });

  if (isPending) {
    return (
      <div className="grid gap-2">
        {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6", "sk-7", "sk-8"]
          .slice(0, 5)
          .map((k) => (
            <Skeleton key={k} className="h-16 w-full" />
          ))}
      </div>
    );
  }

  if (isError)
    return (
      <p className="text-sm text-destructive">
        {getErrorMessage(error, "Failed to load payments.")}
      </p>
    );

  const paid = (data.data ?? []).flatMap((s) =>
    (s.payments ?? []).map((p) => ({
      ...p,
      trackingNumber: s.trackingNumber,
      shipmentId: s.id,
    })),
  );

  if (paid.length === 0)
    return (
      <EmptyState
        title="No payments yet"
        description="Payments appear here after you pay for a shipment with Stripe."
      />
    );

  return (
    <>
      <Card className="hero-card-scope w-full p-0">
        <ScrollShadow
          className="max-h-[520px] p-4"
          orientation="vertical"
          hideScrollBar
        >
          <div className="space-y-3">
            {paid.map((p) => (
              <Card
                key={p.id}
                variant="transparent"
                className="flex-row items-center justify-between gap-4 border border-border bg-card p-3"
              >
                <div className="min-w-0">
                  <Card.Title className="font-mono font-semibold">
                    {p.trackingNumber}
                  </Card.Title>
                  <Card.Description className="text-xs">
                    {p.paidAt
                      ? `Paid ${new Date(p.paidAt).toLocaleString()}`
                      : "Awaiting payment"}
                  </Card.Description>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="text-sm font-semibold text-foreground">
                    ${p.amount.toFixed(2)}{" "}
                    <span className="text-muted-foreground">
                      {p.currency.toUpperCase()}
                    </span>
                  </span>
                  <StatusBadge status={p.status} />
                </div>
              </Card>
            ))}
          </div>
        </ScrollShadow>
      </Card>
      <PaginationControls
        meta={data.meta}
        onPage={(page) => setParams({ page })}
      />
    </>
  );
}
