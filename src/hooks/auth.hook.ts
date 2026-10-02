import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { changePassword, getMe, login, logout, register } from "@/api";
import { useAuthStore } from "@/store/auth.store";
import type {
  ApiResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  UserProfile,
} from "@/types";

function statusOf(error: unknown): number | null {
  return (
    (error as { response?: { status?: number } })?.response?.status ?? null
  );
}

export function useGetMe(enabled = true) {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    // `retry: false` overrode the global `retry: 1`, so a single dropped
    // request turned into a hard error that the guards read as "logged out".
    // Retry transient failures, but never a definitive auth rejection.
    retry: (failureCount, error) => {
      const status = statusOf(error);
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
    staleTime: 60_000,
    enabled,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      const { accessToken, refreshToken } = res.data;
      useAuthStore.getState().setTokens(accessToken, refreshToken);
      // Seed synchronously so guards see the new role instantly on
      // navigation; the invalidation below then refreshes full profile data.
      seedMeCache(queryClient, res.data.user);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: (res) => {
      const { accessToken, refreshToken } = res.data;
      useAuthStore.getState().setTokens(accessToken, refreshToken);
      seedMeCache(queryClient, res.data.user);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function demoLogin(role: "ADMIN" | "CUSTOMER" | "COURIER") {
  const creds: Record<string, LoginPayload> = {
    ADMIN: { email: "admin@quickdrop.com", password: "Admin@1234" },
    CUSTOMER: { email: "customer@quickdrop.com", password: "Customer@1234" },
    COURIER: { email: "courier@quickdrop.com", password: "Courier@1234" },
  };
  return login(creds[role]);
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      useAuthStore.getState().clear();
      queryClient.clear();
      router.replace("/login");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}

/**
 * Synchronously seed the ["me"] cache from an auth response user, so that
 * RoleGuard/AuthGuard render the correct state immediately after
 * login/register/demo-login instead of flashing stale data while the
 * background refetch is in flight. Nested profile fields from a previous
 * fetch of the same user are preserved.
 */
export function seedMeCache(queryClient: QueryClient, user: AuthUser) {
  queryClient.setQueryData<ApiResponse<UserProfile>>(["me"], (old) => {
    const prev = old?.data;
    const sameUser = prev?.id === user.id;
    return {
      success: true,
      message: "",
      data: {
        ...user,
        customer: sameUser ? (prev?.customer ?? null) : null,
        courier: sameUser ? (prev?.courier ?? null) : null,
      } as UserProfile,
      meta: null,
    };
  });
}

export type { LoginPayload, RegisterPayload };
