"use client";

import Link from "next/link";
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
import { useAllShipments } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";

export function AdminDeliveries() {
  const { data, isPending, isError, error } = useAllShipments({
    page: 1,
    limit: 100,
  });

  if (isPending) {
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
  if (isError)
    return <p className="text-sm text-destructive">{getErrorMessage(error)}</p>;

  const withDelivery = (data.data ?? []).filter((s) => s.delivery);

  if (withDelivery.length === 0) {
    return (
      <EmptyState
        title="No deliveries yet"
        description="Assign a courier from a shipment to create a delivery."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Shipment</TableHead>
          <TableHead>Route</TableHead>
          <TableHead>Delivery status</TableHead>
          <TableHead>Shipment status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {withDelivery.map((s) => (
          <TableRow key={s.id}>
            <TableCell>
              <Link
                href={`/admin/shipments/${s.id}`}
                className="font-mono font-semibold text-primary hover:underline"
              >
                {s.trackingNumber}
              </Link>
            </TableCell>
            <TableCell>
              {s.origin} → {s.destination}
            </TableCell>
            <TableCell>
              {s.delivery ? (
                <StatusBadge status={s.delivery.status as "ASSIGNED"} />
              ) : (
                "—"
              )}
            </TableCell>
            <TableCell>
              <StatusBadge status={s.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
