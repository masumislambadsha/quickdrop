import apiClient from "@/lib/apiClient";
import type { ApiResponse, UserProfile } from "@/types";

export interface UpdateMePayload {
  name?: string;
  contactNumber?: string;
  address?: string;
  city?: string;
}

export function updateMe(payload: UpdateMePayload) {
  return apiClient<ApiResponse<UserProfile>>("/users/me", {
    method: "PATCH",
    body: payload,
  });
}
