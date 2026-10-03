export type DeliveryStatus =
  | "ASSIGNED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED"
  | "RETURNED";

export interface Delivery {
  id: string;
  shipmentId: string;
  courierId: string;
  status: DeliveryStatus;
  assignedAt: string;
  pickupAt?: string | null;
  deliveredAt?: string | null;
  failedReason?: string | null;
  shipment?: {
    id: string;
    trackingNumber: string;
    origin: string;
    destination: string;
    recipientName: string;
    recipientPhone: string;
    status: string;
    cost: number;
  };
  courier?: {
    id: string;
    name: string;
    contactNumber?: string | null;
    vehicleType?: string;
    vehicleNumber?: string;
  };
}

export interface DeliveryListQuery {
  page?: number;
  limit?: number;
  status?: DeliveryStatus;
  cursor?: string;
}
