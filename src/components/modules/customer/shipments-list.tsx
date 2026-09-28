"use client";

import {
  PaginationControls,
  ShipmentTable,
  ShipmentTableSkeleton,
} from "@/components/modules/shipments/shipment-table";
import { Input } from "@/components/ui/input";
import { useDebounce, useListParams, useMyShipments } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { ShipmentStatus } from "@/types";

const STATUSES: (ShipmentStatus | "")[] = [
  "",
  "REQUESTED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "FAILED",
  "CANCELLED",
];

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
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={params.status}
          onChange={(e) =>
            setParams({ status: e.target.value }, { resetPage: true })
          }
          aria-label="Filter by status"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s ? s.replaceAll("_", " ") : "All statuses"}
            </option>
          ))}
        </select>
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
