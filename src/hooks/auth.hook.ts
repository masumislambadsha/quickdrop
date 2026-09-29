import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { changePassword, getMe, login, logout, register } from "@/api";
import { useAuthStore } from "@/store/auth.store";
import type { LoginPayload, RegisterPayload } from "@/types";

export function useGetMe(enabled = true) {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
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

export type { LoginPayload, RegisterPayload };
