"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetMe } from "@/hooks";
import { useAuthStore } from "@/store/auth.store";
import AuthError from "./auth-error";
import AuthLoading from "./auth-loading";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isPending, isFetching, isError, refetch } = useGetMe();
  const hasTokens = useAuthStore((s) => !!s.accessToken);
  const user = data?.data;

  // See RoleGuard: only a cleared token store means the session really ended.
  // Tokens surviving a failed request imply a transient problem, so we retry
  // instead of redirecting and losing the user's place.
  const shouldRedirect = !isPending && !isFetching && !user && !hasTokens;

  useEffect(() => {
    if (shouldRedirect) router.replace("/login");
  }, [shouldRedirect, router]);

  if (isPending) return <AuthLoading />;
  if (isFetching && !user) return <AuthLoading />;
  if (shouldRedirect) return <AuthLoading label="Redirecting to login..." />;
  if (isError) return <AuthError onRetry={() => refetch()} />;
  if (!user) return <AuthLoading label="Redirecting to login..." />;
  return <>{children}</>;
}
