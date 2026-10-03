import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Delivery,
  DeliveryListQuery,
  DeliveryStatus,
} from "@/types";

export function getMyDeliveries(query?: DeliveryListQuery) {
  return apiClient<ApiResponse<Delivery[]>>("/deliveries", {
    method: "GET",
    query: {
      ...(query?.page ? { page: query.page } : {}),
      ...(query?.limit ? { limit: query.limit } : {}),
      ...(query?.status ? { status: query.status } : {}),
      ...(query?.cursor ? { cursor: query.cursor } : {}),
    },
  });
}

export function getAssignedDeliveries() {
  return apiClient<ApiResponse<Delivery[]>>("/deliveries/assigned", {
    method: "GET",
  });
}

export function getDeliveryById(id: string) {
  return apiClient<ApiResponse<Delivery>>(`/deliveries/${id}`, {
    method: "GET",
  });
}

export function assignCourier(deliveryId: string, courierId: string) {
  return apiClient<ApiResponse<Delivery>>(
    `/deliveries/${deliveryId}/assign-courier`,
    {
      method: "POST",
      body: { courierId },
    },
  );
}

export function updateDeliveryStatus(
  id: string,
  status: DeliveryStatus,
  failedReason?: string,
) {
  return apiClient<ApiResponse<Delivery>>(`/deliveries/${id}/status`, {
    method: "PATCH",
    body: { status, ...(failedReason ? { failedReason } : {}) },
  });
}

export function confirmDelivery(id: string, code: string) {
  return apiClient<ApiResponse<Delivery>>(`/deliveries/${id}/confirm`, {
    method: "POST",
    body: { code },
  });
}
