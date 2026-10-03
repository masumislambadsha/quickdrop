"use client";

import { CircleAlert, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { useTrackShipment } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";

export function TrackResult({ trackingNumber }: { trackingNumber: string }) {
  const { data, isPending, isError, error } = useTrackShipment(trackingNumber);

  if (isPending) {
    return (
      <div className="flex min-w-0 items-center gap-2 rounded-lg border p-4 text-sm break-words text-muted-foreground sm:p-6">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
        <span className="min-w-0 break-all">
          Looking up {trackingNumber} ...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-w-0 items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm break-words sm:p-6">
        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
        <span className="min-w-0">
          {getErrorMessage(
            error,
            "No shipment found with this tracking number.",
          )}
        </span>
      </div>
    );
  }

  const shipment = data.data;
  return (
    <div className="min-w-0 rounded-lg border p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="min-w-0 font-mono font-bold break-all">
          {shipment.trackingNumber}
        </h2>
        <StatusBadge status={shipment.status} />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {shipment.origin} → {shipment.destination} · {shipment.weightKg} kg ·{" "}
        {shipment.packageType}
      </p>
      <ol className="mt-6 space-y-4 border-l-2 border-muted pl-4">
        {(shipment.trackingEvents ?? []).map((ev, i) => (
          <li key={ev.id ?? i} className="relative">
            <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
            <p className="text-sm font-semibold">
              {ev.status.replaceAll("_", " ")}
            </p>
            <p className="text-sm text-muted-foreground">
              {ev.description} {ev.location ? `· ${ev.location}` : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(ev.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
        {(shipment.trackingEvents ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">
            No tracking events yet.
          </p>
        )}
      </ol>
    </div>
  );
}
