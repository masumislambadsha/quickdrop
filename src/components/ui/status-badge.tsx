import { Badge } from "@/components/ui/badge";
import type { DeliveryStatus, PaymentStatus, ShipmentStatus } from "@/types";

const shipmentVariant: Record<
  ShipmentStatus,
  "default" | "secondary" | "success" | "warning" | "destructive"
> = {
  REQUESTED: "secondary",
  PICKED_UP: "default",
  IN_TRANSIT: "default",
  OUT_FOR_DELIVERY: "warning",
  DELIVERED: "success",
  FAILED: "destructive",
  CANCELLED: "destructive",
};

const deliveryVariant: Record<
  DeliveryStatus,
  "default" | "secondary" | "success" | "warning" | "destructive"
> = {
  ASSIGNED: "secondary",
  PICKED_UP: "default",
  IN_TRANSIT: "default",
  OUT_FOR_DELIVERY: "warning",
  DELIVERED: "success",
  FAILED: "destructive",
  RETURNED: "destructive",
};

const paymentVariant: Record<
  PaymentStatus,
  "default" | "secondary" | "success" | "warning" | "destructive"
> = {
  UNPAID: "secondary",
  PENDING: "warning",
  PAID: "success",
  FAILED: "destructive",
  CANCELLED: "destructive",
  REFUNDED: "default",
};

export function StatusBadge({
  status,
}: {
  status: ShipmentStatus | DeliveryStatus | PaymentStatus;
}) {
  const variant =
    shipmentVariant[status as ShipmentStatus] ??
    deliveryVariant[status as DeliveryStatus] ??
    paymentVariant[status as PaymentStatus] ??
    "default";
  return <Badge variant={variant}>{status.replaceAll("_", " ")}</Badge>;
}
