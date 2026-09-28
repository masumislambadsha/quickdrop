import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  assignCourier,
  confirmDelivery,
  getAssignedDeliveries,
  getDeliveryById,
  getMyDeliveries,
  updateDeliveryStatus,
} from "@/api";
import type { DeliveryListQuery, DeliveryStatus } from "@/types";

export function useMyDeliveries(query: DeliveryListQuery) {
  return useQuery({
    queryKey: ["deliveries", "my", query],
    queryFn: () => getMyDeliveries(query),
    placeholderData: keepPreviousData,
  });
}

export function useAssignedDeliveries() {
  return useQuery({
    queryKey: ["deliveries", "assigned"],
    queryFn: getAssignedDeliveries,
  });
}

export function useDelivery(id: string, enabled = true) {
  return useQuery({
    queryKey: ["deliveries", id],
    queryFn: () => getDeliveryById(id),
    enabled: enabled && id.length > 0,
  });
}

export function useAssignCourier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      deliveryId,
      courierId,
    }: {
      deliveryId: string;
      courierId: string;
    }) => assignCourier(deliveryId, courierId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
}

export function useUpdateDeliveryStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      failedReason,
    }: {
      id: string;
      status: DeliveryStatus;
      failedReason?: string;
    }) => updateDeliveryStatus(id, status, failedReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
}

export function useConfirmDelivery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, code }: { id: string; code: string }) =>
      confirmDelivery(id, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
}
