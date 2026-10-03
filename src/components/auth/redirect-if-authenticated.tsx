"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetMe } from "@/hooks";
import { useAuthStore } from "@/store/auth.store";
import AuthLoading from "./auth-loading";

const PROTECTED_PREFIXES = ["/admin", "/courier", "/dashboard"];

function roleHome(role: string): string {
  if (role === "ADMIN") return "/admin";
  if (role === "COURIER") return "/courier";
  return "/dashboard";
}

function canAccess(role: string, next: string): boolean {
  if (next === "/admin" || next.startsWith("/admin/")) return role === "ADMIN";
  if (next === "/courier" || next.startsWith("/courier/"))
    return role === "COURIER";
  if (next === "/dashboard" || next.startsWith("/dashboard/"))
    return role === "CUSTOMER";
  return false;
}

/**
 * Bounces already-signed-in users away from /login and /register to their
 * role dashboard (or a validated `?next=` destination).
 *
 * The proxy only sees the cookie, which may be absent while the client store
 * (localStorage + Bearer header) still holds a valid session — so this
 * client-side companion covers that case. Only a loaded profile triggers the
 * redirect; a logged-out visitor renders the form with no extra delay.
 */
export default function RedirectIfAuthenticated({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasTokens = useAuthStore((s) => !!s.accessToken);
  const { data, isPending, isFetching } = useGetMe(hasTokens);
  const user = data?.data;

  const next = searchParams.get("next");
  const isValidNext =
    !!next &&
    PROTECTED_PREFIXES.some((p) => next === p || next.startsWith(`${p}/`));
  // Only a loaded profile may trigger the bounce. Computing `dest` from
  // `?next=` alone (before `user` exists) redirects logged-out visitors to a
  // protected route, which immediately bounces back to `/login?next=...` —
  // the Loading... <-> "Redirecting to dashboard..." loop.
  const dest = user
    ? isValidNext && canAccess(user.role, next as string)
      ? (next as string)
      : roleHome(user.role)
    : null;

  useEffect(() => {
    if (dest) router.replace(dest);
  }, [dest, router]);

  if (dest) return <AuthLoading label="Redirecting to dashboard..." />;
  if (hasTokens && (isPending || isFetching))
    return <AuthLoading label="Checking session..." />;
  return <>{children}</>;
}
