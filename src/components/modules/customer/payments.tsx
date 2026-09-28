"use client";

import { PaginationControls } from "@/components/modules/shipments/shipment-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
            <Skeleton key={k} className="h-12 w-full" />
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Shipment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Paid at</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paid.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-mono font-semibold">
                {p.trackingNumber}
              </TableCell>
              <TableCell>
                <StatusBadge status={p.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {p.paidAt ? new Date(p.paidAt).toLocaleString() : "—"}
              </TableCell>
              <TableCell className="text-right font-semibold">
                ${p.amount.toFixed(2)} {p.currency.toUpperCase()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationControls
        meta={data.meta}
        onPage={(page) => setParams({ page })}
      />
    </>
  );
}
