import type { PaymentStatus } from "./shipment.type";

export interface Payment {
  id: string;
  shipmentId: string;
  amount: number;
  currency: string;
  stripeSessionId?: string | null;
  stripeSessionUrl?: string | null;
  stripePaymentIntentId?: string | null;
  status: PaymentStatus;
  receiptUrl?: string | null;
  paidAt?: string | null;
  createdAt: string;
  shipment?: {
    trackingNumber: string;
    origin: string;
    destination: string;
  };
}

export interface InitiatePaymentResponse {
  id: string;
  shipmentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripeSessionUrl: string;
}
