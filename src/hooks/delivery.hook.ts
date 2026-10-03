import {
  keepPreviousData,
  useInfiniteQuery,
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

const HISTORY_LIMIT = 10;

export function useMyDeliveriesInfinite(status?: DeliveryStatus) {
  return useInfiniteQuery({
    queryKey: ["deliveries", "my", "infinite", { status: status ?? null }],
    queryFn: ({ pageParam }) => {
      // pageParam is either a cursor string (new backend) or a page number (legacy offset).
      if (typeof pageParam === "string") {
        return getMyDeliveries({
          limit: HISTORY_LIMIT,
          ...(status ? { status } : {}),
          cursor: pageParam,
        });
      }
      if (typeof pageParam === "number") {
        return getMyDeliveries({
          page: pageParam,
          limit: HISTORY_LIMIT,
          ...(status ? { status } : {}),
        });
      }
      // First chunk: send only limit+status so a cursor-capable backend
      // uses cursor mode, while a legacy backend falls back to page 1.
      return getMyDeliveries({
        limit: HISTORY_LIMIT,
        ...(status ? { status } : {}),
      });
    },
    initialPageParam: undefined as string | number | undefined,
    getNextPageParam: (lastPage, allPages) => {
      const meta = lastPage.meta;
      if (!meta) return undefined;
      // Preferred: cursor mode.
      if (meta.nextCursor) return meta.nextCursor;
      // Legacy offset mode (production backend without cursor support):
      // meta = { page, totalPages, hasNextPage, ... } with no nextCursor.
      if (meta.hasNextPage) {
        const currentPage =
          typeof meta.page === "number" ? meta.page : allPages.length;
        return currentPage + 1;
      }
      // Defensive: cursor backend signals hasMore without nextCursor
      // (should not happen) — fall back to page-number pagination.
      if (meta.hasMore) return allPages.length + 1;
      return undefined;
    },
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
