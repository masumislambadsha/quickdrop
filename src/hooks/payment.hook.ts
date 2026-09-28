import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { getAllPayments, getPaymentStatus, initiatePayment } from "@/api";
import type { PaymentStatus } from "@/types";

export function useInitiatePayment() {
  return useMutation({
    mutationFn: initiatePayment,
    onSuccess: (res) => {
      const url = res.data.stripeSessionUrl;
      if (url) window.location.href = url;
    },
  });
}

export function usePaymentStatus(id: string, enabled = true) {
  return useQuery({
    queryKey: ["payments", id],
    queryFn: () => getPaymentStatus(id),
    enabled: enabled && id.length > 0,
    retry: false,
  });
}

export function useAllPayments(query: {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
}) {
  return useQuery({
    queryKey: ["payments", "all", query],
    queryFn: () => getAllPayments(query),
    placeholderData: keepPreviousData,
  });
}
