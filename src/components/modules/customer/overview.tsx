"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useMyShipments } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";

export function CustomerOverview() {
  const { data, isPending, isError, error } = useMyShipments({
    page: 1,
    limit: 100,
  });

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading your dashboard...
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        {getErrorMessage(error, "Failed to load dashboard.")}
      </p>
    );
  }

  const shipments = data.data;
  const count = (s: string) => shipments.filter((x) => x.status === s).length;
  const stats = [
    { label: "Total shipments", value: shipments.length },
    {
      label: "In progress",
      value:
        count("PICKED_UP") + count("IN_TRANSIT") + count("OUT_FOR_DELIVERY"),
    },
    { label: "Delivered", value: count("DELIVERED") },
    {
      label: "Awaiting payment",
      value: shipments.filter((x) => x.paymentStatus === "UNPAID").length,
    },
  ];
  const recent = shipments.slice(0, 5);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent shipments</CardTitle>
            <Link
              href="/dashboard/shipments"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          {recent.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No shipments yet. Book your first one!
            </p>
          )}
          {recent.map((s) => (
            <Link
              key={s.id}
              href={`/dashboard/shipments/${s.id}`}
              className="flex items-center justify-between rounded-md border p-3 hover:bg-accent"
            >
              <div>
                <p className="font-mono text-sm font-semibold">
                  {s.trackingNumber}
                </p>
                <p className="text-xs text-muted-foreground">
                  {s.origin} → {s.destination}
                </p>
              </div>
              <StatusBadge status={s.status} />
            </Link>
          ))}
        </CardContent>
      </Card>
      <div>
        <Link
          href="/dashboard/shipments/new"
          className="inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          + New shipment
        </Link>
      </div>
    </div>
  );
}
