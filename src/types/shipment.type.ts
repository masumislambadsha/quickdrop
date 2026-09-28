export type ShipmentStatus =
  | "REQUESTED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED"
  | "CANCELLED";

export type PaymentStatus =
  | "UNPAID"
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export type PackageType =
  | "DOCUMENT"
  | "PARCEL"
  | "FRAGILE"
  | "PERISHABLE"
  | "HEAVY";

export type PricingTier = "STANDARD" | "EXPRESS" | "SAME_DAY";

export interface TrackingEvent {
  id?: string;
  status: ShipmentStatus;
  location?: string | null;
  description?: string | null;
  createdAt: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  customerId: string;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  origin: string;
  destination: string;
  distanceKm: number;
  weightKg: number;
  packageType: PackageType;
  declaredValue: number;
  pricingTier: PricingTier;
  cost: number;
  notes?: string | null;
  status: ShipmentStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  customer?: { name: string; email: string };
  delivery?: {
    id: string;
    courierId?: string;
    status: string;
    courier?: { name: string; contactNumber?: string | null };
  } | null;
  payments?: {
    id: string;
    amount: number;
    status: PaymentStatus;
    currency: string;
    stripeSessionUrl?: string | null;
    receiptUrl?: string | null;
    paidAt?: string | null;
  }[];
  trackingEvents?: TrackingEvent[];
}

export interface CreateShipmentPayload {
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  origin: string;
  destination: string;
  distanceKm: number;
  weightKg: number;
  packageType: PackageType;
  declaredValue?: number;
  pricingTier: PricingTier;
  notes?: string;
}

export interface ShipmentListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ShipmentStatus;
}
