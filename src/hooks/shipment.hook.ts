import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  adminUpdateShipment,
  cancelShipment,
  createShipment,
  getMyShipments,
  getShipmentById,
  getShipments,
  searchShipments,
  trackShipment,
  updateShipmentStatus,
} from "@/api";
import type { ShipmentListQuery } from "@/types";

export function useMyShipments(query: ShipmentListQuery) {
  return useQuery({
    queryKey: ["shipments", "my", query],
    queryFn: () => getMyShipments(query),
    placeholderData: keepPreviousData,
  });
}

export function useAllShipments(query: ShipmentListQuery) {
  return useQuery({
    queryKey: ["shipments", "all", query],
    queryFn: () => getShipments(query),
    placeholderData: keepPreviousData,
  });
}

export function useShipment(id: string, enabled = true) {
  return useQuery({
    queryKey: ["shipments", id],
    queryFn: () => getShipmentById(id),
    enabled: enabled && id.length > 0,
  });
}

export function useTrackShipment(trackingNumber: string, enabled = true) {
  return useQuery({
    queryKey: ["track", trackingNumber],
    queryFn: () => trackShipment(trackingNumber),
    enabled: enabled && trackingNumber.trim().length > 0,
    retry: false,
  });
}

export function useSearchShipments(search: string, enabled = true) {
  return useQuery({
    queryKey: ["shipments", "search", search],
    queryFn: () => searchShipments(search),
    enabled: enabled && search.trim().length >= 3,
  });
}

export function useCreateShipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
}

export function useCancelShipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
}

export function useUpdateShipmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateShipmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
}

export function useAdminUpdateShipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof adminUpdateShipment>[1];
    }) => adminUpdateShipment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
}
