import { type FetchOptions, ofetch } from "ofetch";
import { useAuthStore } from "@/store/auth.store";
import type { ApiErrorBody } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

const raw = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
});

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) return false;

  refreshPromise = (async () => {
    try {
      // Backend accepts the refresh token via body (works cross-site) or cookie.
      const res = (await raw("/auth/refresh-token", {
        method: "POST",
        body: { refreshToken },
      })) as { data?: { accessToken?: string; refreshToken?: string } };
      const accessToken = res?.data?.accessToken;
      const nextRefresh = res?.data?.refreshToken;
      if (accessToken && nextRefresh) {
        useAuthStore.getState().setTokens(accessToken, nextRefresh);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function withAuth(options?: FetchOptions<"json">): FetchOptions<"json"> {
  const token = useAuthStore.getState().accessToken;
  if (!token) return options ?? {};
  const headers = new Headers(options?.headers ?? {});
  headers.set("Authorization", `Bearer ${token}`);
  return { ...options, headers };
}

function isAuthEndpoint(url: string): boolean {
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/refresh-token")
  );
}

function statusOf(error: unknown): number | null {
  return (
    (error as { response?: { status?: number } })?.response?.status ?? null
  );
}

/**
 * Typed API caller with cookie + Bearer auth and single 401 → refresh → retry.
 * Same call signature as ofetch: apiClient<T>(url, options).
 */
async function apiClient<T>(
  url: string,
  options?: FetchOptions<"json">,
): Promise<T> {
  try {
    return await raw<T>(url, withAuth(options));
  } catch (error) {
    if (statusOf(error) !== 401 || isAuthEndpoint(url)) throw error;
    const ok = await tryRefresh();
    if (!ok) {
      useAuthStore.getState().clear();
      throw error;
    }
    return raw<T>(url, withAuth(options));
  }
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong.",
): string {
  const data = (error as { data?: ApiErrorBody })?.data;
  if (data?.message) return data.message;
  const err = error as { message?: string };
  if (
    typeof err?.message === "string" &&
    err.message &&
    !err.message.includes("fetch")
  )
    return err.message;
  return fallback;
}

export default apiClient;
