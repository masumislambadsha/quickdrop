import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UserProfile,
} from "@/types";

export function login(payload: LoginPayload) {
  return apiClient<ApiResponse<AuthResponse>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function register(payload: RegisterPayload) {
  return apiClient<ApiResponse<AuthResponse>>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function logout() {
  return apiClient<ApiResponse<null>>("/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiClient<ApiResponse<UserProfile>>("/users/me", { method: "GET" });
}

export function changePassword(payload: {
  oldPassword: string;
  newPassword: string;
}) {
  return apiClient<ApiResponse<null>>("/auth/change-password", {
    method: "POST",
    body: payload,
  });
}

export function googleLogin(payload: { idToken?: string; code?: string }) {
  return apiClient<ApiResponse<AuthResponse>>("/auth/google/login", {
    method: "POST",
    body: payload,
  });
}
