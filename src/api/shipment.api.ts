import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateShipmentPayload,
  Shipment,
  ShipmentListQuery,
} from "@/types";

function toQuery(query?: ShipmentListQuery): Record<string, string> {
  const params: Record<string, string> = {};
  if (!query) return params;
  if (query.page) params.page = String(query.page);
  if (query.limit) params.limit = String(query.limit);
  if (query.search) params.search = query.search;
  if (query.status) params.status = query.status;
  if (query.cursor) params.cursor = query.cursor;
  if (query.hasDelivery) params.hasDelivery = "true";
  return params;
}

export function createShipment(payload: CreateShipmentPayload) {
  return apiClient<ApiResponse<Shipment>>("/shipments", {
    method: "POST",
    body: payload,
  });
}

export function getShipments(query?: ShipmentListQuery) {
  return apiClient<ApiResponse<Shipment[]>>("/shipments", {
    method: "GET",
    query: toQuery(query),
  });
}

export function getMyShipments(query?: ShipmentListQuery) {
  return apiClient<ApiResponse<Shipment[]>>("/shipments/my", {
    method: "GET",
    query: toQuery(query),
  });
}

export function searchShipments(search: string) {
  return apiClient<ApiResponse<Shipment[]>>("/shipments/search", {
    method: "GET",
    query: { search },
  });
}

export function trackShipment(trackingNumber: string) {
  return apiClient<ApiResponse<Shipment>>(
    `/shipments/track/${encodeURIComponent(trackingNumber)}`,
    {
      method: "GET",
    },
  );
}

export function getShipmentById(id: string) {
  return apiClient<ApiResponse<Shipment>>(`/shipments/${id}`, {
    method: "GET",
  });
}

export function cancelShipment(id: string) {
  return apiClient<ApiResponse<Shipment>>(`/shipments/${id}/cancel`, {
    method: "PATCH",
  });
}

export function updateShipmentStatus(id: string, status: string) {
  return apiClient<ApiResponse<unknown>>(`/shipments/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function adminUpdateShipment(
  id: string,
  payload: Partial<CreateShipmentPayload>,
) {
  return apiClient<ApiResponse<Shipment>>(`/shipments/${id}`, {
    method: "PATCH",
    body: payload,
  });
}
