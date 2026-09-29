import { cn } from "@/lib/utils";
import type { DeliveryStatus, PaymentStatus, ShipmentStatus } from "@/types";

type Tone = "neutral" | "info" | "transit" | "action" | "good" | "bad";

const shipmentTone: Record<ShipmentStatus, Tone> = {
  REQUESTED: "neutral",
  PICKED_UP: "info",
  IN_TRANSIT: "transit",
  OUT_FOR_DELIVERY: "action",
  DELIVERED: "good",
  FAILED: "bad",
  CANCELLED: "bad",
};

const deliveryTone: Record<DeliveryStatus, Tone> = {
  ASSIGNED: "neutral",
  PICKED_UP: "info",
  IN_TRANSIT: "transit",
  OUT_FOR_DELIVERY: "action",
  DELIVERED: "good",
  FAILED: "bad",
  RETURNED: "bad",
};

const paymentTone: Record<PaymentStatus, Tone> = {
  UNPAID: "neutral",
  PENDING: "action",
  PAID: "good",
  FAILED: "bad",
  CANCELLED: "bad",
  REFUNDED: "info",
};

const toneClass: Record<Tone, string> = {
  neutral: "bg-ink/10 text-ink",
  info: "bg-forest text-cream",
  transit: "bg-leaf/25 text-ink",
  action: "bg-pop text-ink",
  good: "bg-lime text-ink",
  bad: "bg-[#d64545] text-white",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ShipmentStatus | DeliveryStatus | PaymentStatus;
  className?: string;
}) {
  const tone =
    shipmentTone[status as ShipmentStatus] ??
    deliveryTone[status as DeliveryStatus] ??
    paymentTone[status as PaymentStatus] ??
    "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.06em]",
        toneClass[tone],
        className,
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
