"use client";

import { PaginationControls } from "@/components/modules/shipments/shipment-table";
import { PAYMENT_STATUS_OPTIONS } from "@/components/modules/shipments/status-options";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
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
import { useAllPayments, useListParams } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { PaymentStatus } from "@/types";

export function AdminPayments() {
  const { params, setParams } = useListParams();
  const { data, isPending, isError, error } = useAllPayments({
    page: params.page,
    limit: 10,
    status: (params.status as PaymentStatus) || undefined,
  });

  return (
    <div className="grid gap-4">
      <Select
        label="Filter by payment status"
        value={params.status}
        onChange={(v) => setParams({ status: v }, { resetPage: true })}
        options={PAYMENT_STATUS_OPTIONS}
      />

      {isPending ? (
        <div className="grid gap-2">
          {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6", "sk-7", "sk-8"]
            .slice(0, 5)
            .map((k) => (
              <Skeleton key={k} className="h-12 w-full" />
            ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">{getErrorMessage(error)}</p>
      ) : (data.data ?? []).length === 0 ? (
        <EmptyState title="No payments found" />
      ) : (
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
              {(data.data ?? []).map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono font-semibold">
                    {p.shipment?.trackingNumber ?? p.shipmentId.slice(0, 8)}
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
      )}
    </div>
  );
}
