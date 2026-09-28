"use client";

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
    { label: "Completed deliveries", value: delivered.length },
    { label: "Active jobs", value: active.length },
    { label: "Failed", value: failed.length },
    { label: "Parcel value handled", value: `$${revenue.toFixed(2)}` },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {c.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{c.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
