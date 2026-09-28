import {
  keepPreviousData,
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
