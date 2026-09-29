"use client";

import { Banknote, Bike, PackageCheck, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyDeliveries } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";

export function CourierEarnings() {
  const { data, isPending, isError, error } = useMyDeliveries({
    page: 1,
    limit: 100,
  });

  if (isPending)
    return <p className="text-sm text-muted-foreground">Loading earnings...</p>;
  if (isError)
    return <p className="text-sm text-destructive">{getErrorMessage(error)}</p>;

  const all = data.data ?? [];
  const delivered = all.filter((d) => d.status === "DELIVERED");
  const active = all.filter(
    (d) => !["DELIVERED", "FAILED", "RETURNED"].includes(d.status),
  );
  const failed = all.filter((d) => d.status === "FAILED");
  const revenue = delivered.reduce(
    (sum, d) => sum + (d.shipment?.cost ?? 0),
    0,
  );

  const cards = [
    {
      label: "Completed deliveries",
      value: delivered.length,
      icon: PackageCheck,
    },
    { label: "Active jobs", value: active.length, icon: Bike },
    { label: "Failed", value: failed.length, icon: XCircle },
    {
      label: "Parcel value handled",
      value: `$${revenue.toFixed(2)}`,
      icon: Banknote,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label} className="card-float border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-sm font-bold text-ink/60">
              {c.label}
            </CardTitle>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint text-forest">
              <c.icon className="h-4 w-4" strokeWidth={2.5} />
            </span>
          </CardHeader>
          <CardContent>
            <p className="display text-4xl text-ink">{c.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
