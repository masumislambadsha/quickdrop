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
import type { PaginationMeta, Shipment } from "@/types";

export function ShipmentTableSkeleton() {
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

export function ShipmentTable({
  shipments,
  detailHref,
  emptyTitle = "No shipments found",
  emptyDescription = "Try adjusting your filters, or create a new shipment.",
}: {
  shipments: Shipment[];
  detailHref: (id: string) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (shipments.length === 0)
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tracking #</TableHead>
          <TableHead>Route</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead className="text-right">Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shipments.map((s) => (
          <TableRow key={s.id}>
            <TableCell>
              <Link
                href={detailHref(s.id)}
                className="font-mono font-semibold text-primary hover:underline"
              >
                {s.trackingNumber}
              </Link>
              <p className="text-xs text-muted-foreground">
                {new Date(s.createdAt).toLocaleDateString()}
              </p>
            </TableCell>
            <TableCell>
              {s.origin} → {s.destination}
              <p className="text-xs text-muted-foreground">{s.recipientName}</p>
            </TableCell>
            <TableCell>
              <StatusBadge status={s.status} />
            </TableCell>
            <TableCell>
              <StatusBadge status={s.paymentStatus} />
            </TableCell>
            <TableCell className="text-right font-semibold">
              ${s.cost.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function PaginationControls({
  meta,
  onPage,
}: {
  meta: PaginationMeta | null;
  onPage: (page: number) => void;
}) {
  if (!meta || meta.totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-4 text-sm">
      <p className="text-muted-foreground">
        Page {meta.page} of {meta.totalPages} · {meta.total} total
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={!meta.hasPrevPage}
          onClick={() => onPage(meta.page - 1)}
          className="rounded-md border px-3 py-1.5 disabled:opacity-40 hover:bg-accent cursor-pointer"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={!meta.hasNextPage}
          onClick={() => onPage(meta.page + 1)}
          className="rounded-md border px-3 py-1.5 disabled:opacity-40 hover:bg-accent cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
