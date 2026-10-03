"use client";

import { PAYMENT_STATUS_OPTIONS } from "@/components/modules/shipments/status-options";
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
import { useAllPaymentsInfinite, useListParams } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { PaymentStatus } from "@/types";

const ADMIN_PAYMENTS_GRID = "sm:grid-cols-[150px_minmax(0,1fr)_auto_auto]";

export function AdminPayments() {
  const { params, setParams } = useListParams();
  const statusFilter = (params.status as PaymentStatus) || undefined;
  const history = useAllPaymentsInfinite({
    ...(statusFilter ? { status: statusFilter } : {}),
  });

  const items = history.data?.pages.flatMap((p) => p.data) ?? [];
  const total = history.data?.pages[0]?.meta?.total ?? 0;

  return (
    <div className="grid w-full min-w-0 gap-4">
      <Select
        label="Filter by payment status"
        value={params.status}
        onChange={(v) => setParams({ status: v }, { resetPage: true })}
        options={PAYMENT_STATUS_OPTIONS}
      />

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
        <EmptyState title="No payments found" />
      ) : (
        <>
          <DataTableShell>
            <DataTableHeader
              gridClass={ADMIN_PAYMENTS_GRID}
              columns={[
                { label: "Shipment" },
                { label: "Paid" },
                { label: "Status", className: "sm:justify-self-end" },
                { label: "Amount", className: "sm:text-right" },
              ]}
            />
            <DataTableBody>
              <DataTableRows>
                {items.map((p) => (
                  <DataTableRow key={p.id} gridClass={ADMIN_PAYMENTS_GRID}>
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[15px] font-medium text-slate-900">
                        {p.shipment?.trackingNumber ?? p.shipmentId.slice(0, 8)}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {p.shipment?.customer?.name ?? p.currency.toUpperCase()}
                      </p>
                    </div>
                    <p className="min-w-0 truncate text-sm text-slate-600">
                      {p.paidAt ? new Date(p.paidAt).toLocaleString() : "—"}
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
