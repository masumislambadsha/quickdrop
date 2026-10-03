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
    customer?: { name: string; email: string };
  };
}

export interface InitiatePaymentResponse {
  paymentId: string;
  stripeSessionUrl: string | null;
  stripeSessionId?: string | null;
  status: PaymentStatus;
  message?: string;
}
