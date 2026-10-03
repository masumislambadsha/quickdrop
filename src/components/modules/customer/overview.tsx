"use client";

import {
  CreditCard,
  Loader2,
  Package,
  PackageCheck,
  Truck,
} from "lucide-react";
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
    { label: "Total shipments", value: shipments.length, icon: Package },
    {
      label: "In progress",
      value:
        count("PICKED_UP") + count("IN_TRANSIT") + count("OUT_FOR_DELIVERY"),
      icon: Truck,
    },
    { label: "Delivered", value: count("DELIVERED"), icon: PackageCheck },
    {
      label: "Awaiting payment",
      value: shipments.filter((x) => x.paymentStatus === "UNPAID").length,
      icon: CreditCard,
    },
  ];
  const recent = shipments.slice(0, 5);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="card-float border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-sm font-bold text-ink/60">
                {s.label}
              </CardTitle>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint text-forest">
                <s.icon className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </CardHeader>
            <CardContent>
              <p className="display text-4xl text-ink">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-ink/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="display text-xl text-ink">
              Recent shipments
            </CardTitle>
            <Link
              href="/dashboard/shipments"
              className="text-sm font-bold text-forest hover:underline"
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
              className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-ink/10 p-3 transition-colors hover:bg-cream"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-sm font-bold text-ink">
                  {s.trackingNumber}
                </p>
                <p className="truncate text-xs text-ink/50">
                  {s.origin} → {s.destination}
                </p>
              </div>
              <StatusBadge status={s.status} className="shrink-0" />
            </Link>
          ))}
        </CardContent>
      </Card>
      <div>
        <Link href="/dashboard/shipments/new" className="btn-lime !text-sm">
          + New shipment
        </Link>
      </div>
    </div>
  );
}
