"use client";

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
import { useMyShipmentsInfinite } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";

export const PAYMENTS_GRID = "sm:grid-cols-[150px_minmax(0,1fr)_auto_auto]";

export function CustomerPayments() {
  const history = useMyShipmentsInfinite();

  const paid = (history.data?.pages.flatMap((p) => p.data) ?? []).flatMap((s) =>
    (s.payments ?? []).map((p) => ({
      ...p,
      trackingNumber: s.trackingNumber,
      shipmentId: s.id,
    })),
  );

  if (history.isPending) {
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

  if (history.isError)
    return (
      <p className="text-sm text-destructive">
        {getErrorMessage(history.error, "Failed to load payments.")}
      </p>
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
      <DataTableShell>
        <DataTableHeader
          gridClass={PAYMENTS_GRID}
          columns={[
            { label: "Shipment" },
            { label: "Paid" },
            { label: "Status", className: "sm:justify-self-end" },
            { label: "Amount", className: "sm:text-right" },
          ]}
        />
        <DataTableBody>
          <DataTableRows>
            {paid.map((p) => (
              <DataTableRow key={p.id} gridClass={PAYMENTS_GRID}>
                <div className="min-w-0">
                  <p className="truncate font-mono text-[15px] font-medium text-slate-900">
                    {p.trackingNumber}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {p.currency.toUpperCase()}
                  </p>
                </div>
                <p className="min-w-0 truncate text-sm text-slate-600">
                  {p.paidAt
                    ? new Date(p.paidAt).toLocaleString()
                    : "Awaiting payment"}
                </p>
                <div className="min-w-0 shrink-0 sm:justify-self-end">
                  <StatusBadge status={p.status} />
                </div>
                <p className="min-w-0 text-[15px] font-semibold text-slate-900 sm:text-right">
                  ${p.amount.toFixed(2)}
                </p>
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
        shown={paid.length}
        hasNextPage={history.hasNextPage}
        isLoading={history.isFetchingNextPage}
        onLoadMore={() => history.fetchNextPage()}
      />
    </>
  );
}
