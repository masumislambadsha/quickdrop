import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AuditLog,
  DashboardStats,
  ManagedUser,
  UserRole,
} from "@/types";

export function getDashboardStats() {
  return apiClient<ApiResponse<DashboardStats>>("/admin/dashboard-stats", {
    method: "GET",
  });
}

export function getAuditLogs(query?: {
  page?: number;
  limit?: number;
  action?: string;
  cursor?: string;
}) {
  return apiClient<ApiResponse<AuditLog[]>>("/admin/audit-logs", {
    method: "GET",
    query: {
      ...(query?.page ? { page: query.page } : {}),
      ...(query?.limit ? { limit: query.limit } : {}),
      ...(query?.action ? { action: query.action } : {}),
      ...(query?.cursor ? { cursor: query.cursor } : {}),
    },
  });
}

export function changeUserRole(userId: string, role: UserRole) {
  return apiClient<ApiResponse<ManagedUser>>(`/admin/users/${userId}/role`, {
    method: "PATCH",
    body: { role },
  });
}

export function changeUserStatus(userId: string, status: "ACTIVE" | "BLOCKED") {
  return apiClient<ApiResponse<ManagedUser>>(`/admin/users/${userId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function getAllUsers(query?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  cursor?: string;
}) {
  return apiClient<ApiResponse<ManagedUser[]>>("/users", {
    method: "GET",
    query: {
      ...(query?.page ? { page: query.page } : {}),
      ...(query?.limit ? { limit: query.limit } : {}),
      ...(query?.search ? { search: query.search } : {}),
      ...(query?.role ? { role: query.role } : {}),
      ...(query?.cursor ? { cursor: query.cursor } : {}),
    },
  });
}
