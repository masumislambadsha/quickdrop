"use client";

import Link from "next/link";
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
import { useAssignedDeliveries, useListParams, useMyDeliveries } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { DeliveryStatus } from "@/types";

const STATUSES: (DeliveryStatus | "")[] = [
  "",
  "ASSIGNED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "FAILED",
  "RETURNED",
];

export function CourierTasks() {
  const { params, setParams } = useListParams();
  const assigned = useAssignedDeliveries();
  const mine = useMyDeliveries({
    page: params.page,
    limit: 10,
    status: (params.status as DeliveryStatus) || undefined,
  });

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Currently assigned</h2>
        {assigned.isPending ? (
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        ) : assigned.isError ? (
          <p className="mt-2 text-sm text-destructive">
            {getErrorMessage(assigned.error)}
          </p>
        ) : (assigned.data.data ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No active assignment — you are available for new jobs.
          </p>
        ) : (
          <div className="mt-2 grid gap-2">
            {(assigned.data.data ?? []).map((d) => (
              <Link
                key={d.id}
                href={`/courier/deliveries/${d.id}`}
                className="flex items-center justify-between rounded-md bg-muted p-3 hover:bg-accent"
              >
                <div>
                  <p className="font-mono text-sm font-semibold">
                    {d.shipment?.trackingNumber ?? d.shipmentId}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {d.shipment?.origin} → {d.shipment?.destination}
                  </p>
                </div>
                <StatusBadge status={d.status} />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Delivery history</h2>
          <select
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={params.status}
            onChange={(e) =>
              setParams({ status: e.target.value }, { resetPage: true })
            }
            aria-label="Filter by delivery status"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s ? s.replaceAll("_", " ") : "All statuses"}
              </option>
            ))}
          </select>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(mine.data.data ?? []).map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <Link
                        href={`/courier/deliveries/${d.id}`}
                        className="font-mono font-semibold text-primary hover:underline"
                      >
                        {d.shipment?.trackingNumber ?? d.shipmentId.slice(0, 8)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {d.shipment
                        ? `${d.shipment.origin} → ${d.shipment.destination}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={d.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(d.assignedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
