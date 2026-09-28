import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  InitiatePaymentResponse,
  Payment,
  PaymentStatus,
} from "@/types";

export function initiatePayment(shipmentId: string) {
  return apiClient<ApiResponse<InitiatePaymentResponse>>("/payments", {
    method: "POST",
    body: { shipmentId },
  });
}

export function getPaymentStatus(id: string) {
  return apiClient<ApiResponse<Payment>>(`/payments/${id}`, { method: "GET" });
}

export function getAllPayments(query?: {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
}) {
  return apiClient<ApiResponse<Payment[]>>("/payments", {
    method: "GET",
    query: {
      ...(query?.page ? { page: query.page } : {}),
      ...(query?.limit ? { limit: query.limit } : {}),
      ...(query?.status ? { status: query.status } : {}),
    },
  });
}
