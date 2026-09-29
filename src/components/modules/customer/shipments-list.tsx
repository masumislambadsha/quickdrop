"use client";

import {
  PaginationControls,
  ShipmentTable,
  ShipmentTableSkeleton,
} from "@/components/modules/shipments/shipment-table";
import { SHIPMENT_STATUS_OPTIONS } from "@/components/modules/shipments/status-options";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useDebounce, useListParams, useMyShipments } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { ShipmentStatus } from "@/types";

export function MyShipmentsList() {
  const { params, setParams } = useListParams();
  const debouncedSearch = useDebounce(params.search, 500);

  const { data, isPending, isError, error } = useMyShipments({
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
        <p className="text-sm text-destructive">
          {getErrorMessage(error, "Failed to load shipments.")}
        </p>
      ) : (
        <>
          <ShipmentTable
            shipments={data.data}
            detailHref={(id) => `/dashboard/shipments/${id}`}
          />
          <PaginationControls
            meta={data.meta}
            onPage={(page) => setParams({ page })}
          />
        </>
      )}
    </div>
  );
}
