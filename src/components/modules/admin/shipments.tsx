"use client";

import {
  PaginationControls,
  ShipmentTable,
  ShipmentTableSkeleton,
} from "@/components/modules/shipments/shipment-table";
import { SHIPMENT_STATUS_OPTIONS } from "@/components/modules/shipments/status-options";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAllShipments, useDebounce, useListParams } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { ShipmentStatus } from "@/types";

export function AdminShipments() {
  const { params, setParams } = useListParams();
  const debouncedSearch = useDebounce(params.search, 500);
  const { data, isPending, isError, error } = useAllShipments({
    page: params.page,
    limit: 10,
    search: debouncedSearch || undefined,
    status: (params.status as ShipmentStatus) || undefined,
  });
  return (
    <div className="grid gap-4">
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

      {isPending ? (
        <ShipmentTableSkeleton />
      ) : isError ? (
        <p className="text-sm text-destructive">{getErrorMessage(error)}</p>
      ) : (
        <>
          <ShipmentTable
            shipments={data.data}
            detailHref={(id) => `/admin/shipments/${id}`}
          />
          <PaginationControls
            meta={data.meta}
            onPage={(page) => setParams({ page })}
          />
          <p className="text-xs text-muted-foreground">
            Tip: open a shipment to assign a courier or update its status.
          </p>
        </>
      )}
    </div>
  );
}
