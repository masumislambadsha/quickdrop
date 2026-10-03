import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  changeUserRole,
  changeUserStatus,
  getAllUsers,
  getAuditLogs,
  getDashboardStats,
} from "@/api";
import type { UserRole } from "@/types";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getDashboardStats,
    staleTime: 30_000,
  });
}

export function useAuditLogs(query: {
  page?: number;
  limit?: number;
  action?: string;
}) {
  return useQuery({
    queryKey: ["admin", "audit-logs", query],
    queryFn: () => getAuditLogs(query),
    placeholderData: keepPreviousData,
  });
}

export function useAuditLogsInfinite() {
  return useInfiniteQuery({
    queryKey: ["admin", "audit-logs", "infinite"],
    queryFn: ({ pageParam }) =>
      getAuditLogs({
        limit: 10,
        ...(pageParam ? { cursor: pageParam as string } : {}),
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.meta?.nextCursor ?? undefined,
  });
}

export function useAllUsers(query: {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
}) {
  return useQuery({
    queryKey: ["admin", "users", query],
    queryFn: () => getAllUsers(query),
    placeholderData: keepPreviousData,
  });
}

export function useAllUsersInfinite(query: {
  search?: string;
  role?: UserRole;
}) {
  return useInfiniteQuery({
    queryKey: ["admin", "users", "infinite", query],
    queryFn: ({ pageParam }) =>
      getAllUsers({
        ...query,
        limit: 10,
        ...(pageParam ? { cursor: pageParam as string } : {}),
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.meta?.nextCursor ?? undefined,
  });
}

export function useChangeUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      changeUserRole(userId, role),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

export function useChangeUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: "ACTIVE" | "BLOCKED";
    }) => changeUserStatus(userId, status),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}
