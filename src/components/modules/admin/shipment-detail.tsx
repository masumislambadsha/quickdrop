"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShipmentDetail } from "@/components/modules/shipments/shipment-detail";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  useAllUsers,
  useAssignCourier,
  useShipment,
  useUpdateShipmentStatus,
} from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { ShipmentStatus } from "@/types";

const ALL_STATUSES: ShipmentStatus[] = [
  "REQUESTED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "FAILED",
  "CANCELLED",
];

export function AdminShipmentDetail({ id }: { id: string }) {
  const { data, isPending, isError, error, refetch } = useShipment(id);
  const { data: couriers } = useAllUsers({ role: "COURIER", limit: 100 });
  const assignMutation = useAssignCourier();
  const statusMutation = useUpdateShipmentStatus();
  const [courierId, setCourierId] = useState("");
  const [status, setStatus] = useState<ShipmentStatus>("PICKED_UP");

  if (isPending)
    return <p className="text-sm text-muted-foreground">Loading shipment...</p>;
  if (isError)
    return <p className="text-sm text-destructive">{getErrorMessage(error)}</p>;

  const s = data.data;
  const hasDelivery = !!s.delivery;
  const deliveryStatus = s.delivery?.status;
  const courierName =
    s.delivery && "courier" in s.delivery
      ? (s.delivery as { courier?: { name?: string } }).courier?.name
      : undefined;

  const onAssign = async () => {
    if (!courierId) {
      toast.error("Select a courier first.");
      return;
    }
    try {
      await assignMutation.mutateAsync({ deliveryId: s.id, courierId });
      toast.success("Courier assigned.");
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not assign courier."));
    }
  };

  const onStatus = async () => {
    try {
      await statusMutation.mutateAsync({ id: s.id, status });
      toast.success("Shipment status updated.");
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, "Status transition not allowed."));
    }
  };

  return (
    <div className="grid gap-6">
      <ShipmentDetail id={id} backHref="/admin/shipments" showActions={false} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Courier assignment</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {hasDelivery ? (
              <p className="text-sm">
                Assigned delivery:{" "}
                <StatusBadge status={deliveryStatus as ShipmentStatus} />
                {courierName ? ` · ${courierName}` : ""}
              </p>
            ) : (
              <>
                <div className="grid gap-1.5">
                  <Label>Available courier (by user account)</Label>
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={courierId}
                    onChange={(e) => setCourierId(e.target.value)}
                  >
                    <option value="">Select courier...</option>
                    {(couriers?.data ?? [])
                      .filter((u) => u.status === "ACTIVE")
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} · {u.email}
                        </option>
                      ))}
                  </select>
                </div>
                <Button onClick={onAssign} disabled={assignMutation.isPending}>
                  {assignMutation.isPending ? "Assigning..." : "Assign courier"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Force status transition</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-1.5">
              <Label>New status (current: {s.status})</Label>
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
              >
                {ALL_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="outline"
              onClick={onStatus}
              disabled={statusMutation.isPending}
            >
              {statusMutation.isPending ? "Updating..." : "Update status"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
