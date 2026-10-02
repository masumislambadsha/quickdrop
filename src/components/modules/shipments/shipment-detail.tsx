"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useCancelShipment, useInitiatePayment, useShipment } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";

export function ShipmentDetail({
  id,
  backHref,
  showActions = true,
}: {
  id: string;
  backHref: string;
  showActions?: boolean;
}) {
  const { data, isPending, isError, error, refetch } = useShipment(id);
  const cancelMutation = useCancelShipment();
  const payMutation = useInitiatePayment();

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading shipment...
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        {getErrorMessage(error, "Shipment not found.")}
      </p>
    );
  }

  const s = data.data;
  const canCancel = ["REQUESTED", "PICKED_UP"].includes(s.status);
  const needsPayment =
    s.paymentStatus === "UNPAID" || s.paymentStatus === "PENDING";

  const onPay = async () => {
    try {
      toast.info("Redirecting to Stripe Checkout...");
      await payMutation.mutateAsync(s.id);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not start payment."));
    }
  };

  const onCancel = async () => {
    if (!confirm("Cancel this shipment?")) return;
    try {
      await cancelMutation.mutateAsync(s.id);
      toast.success("Shipment cancelled.");
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not cancel shipment."));
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <a
          href={backHref}
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to list
        </a>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h2 className="font-mono text-2xl font-bold">{s.trackingNumber}</h2>
          <StatusBadge status={s.status} />
          <StatusBadge status={s.paymentStatus} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shipment info</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between border-b pb-2">
                <dt className="text-muted-foreground">Route</dt>
                <dd className="font-medium">
                  {s.origin} → {s.destination}
                </dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-muted-foreground">Sender</dt>
                <dd className="font-medium">
                  {s.senderName} · {s.senderPhone}
                </dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-muted-foreground">Recipient</dt>
                <dd className="font-medium">
                  {s.recipientName} · {s.recipientPhone}
                </dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-muted-foreground">Parcel</dt>
                <dd className="font-medium">
                  {s.weightKg} kg · {s.packageType} · {s.pricingTier}
                </dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-muted-foreground">Distance</dt>
                <dd className="font-medium">{s.distanceKm} km</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Cost</dt>
                <dd className="text-lg font-bold">${s.cost.toFixed(2)}</dd>
              </div>
            </dl>
            {s.deliveryCode ? (
              <p className="mt-4 rounded-md bg-lime/25 p-3 text-sm">
                Delivery code:{" "}
                <strong className="font-mono text-base tracking-widest">
                  {s.deliveryCode}
                </strong>
                <span className="mt-1 block text-xs text-muted-foreground">
                  Share this code with your courier when your package arrives —
                  they need it to mark the delivery complete.
                </span>
              </p>
            ) : null}
            {s.delivery?.courier ? (
              <p className="mt-4 rounded-md bg-muted p-3 text-sm">
                Courier: <strong>{s.delivery.courier.name}</strong>
                {s.delivery.courier.contactNumber
                  ? ` · ${s.delivery.courier.contactNumber}`
                  : ""}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {showActions && needsPayment && s.status !== "CANCELLED" ? (
                <Button onClick={onPay} disabled={payMutation.isPending}>
                  {payMutation.isPending
                    ? "Starting payment..."
                    : `Pay $${s.cost.toFixed(2)} with Stripe`}
                </Button>
              ) : null}
              {showActions && canCancel ? (
                <Button
                  variant="destructive"
                  onClick={onCancel}
                  disabled={cancelMutation.isPending}
                >
                  Cancel shipment
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tracking timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 border-l-2 border-muted pl-4">
              {(s.trackingEvents ?? []).map((ev, i) => (
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
              {(s.trackingEvents ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No tracking events yet.
                </p>
              )}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
