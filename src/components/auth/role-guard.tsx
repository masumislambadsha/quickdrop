"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetMe } from "@/hooks";
import { useAuthStore } from "@/store/auth.store";
import type { UserRole } from "@/types";
import AccessDenied from "./access-denied";
import AuthError from "./auth-error";
import AuthLoading from "./auth-loading";

interface RoleGuardProps {
  children: ReactNode;
  roles: UserRole[];
}

export default function RoleGuard({ children, roles }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isPending, isFetching, isError, refetch } = useGetMe();
  const hasTokens = useAuthStore((s) => !!s.accessToken);
  const user = data?.data;
  const isAuthorized = !!user && roles.includes(user.role);

  // Tokens are only cleared on a definitive refresh rejection (see
  // apiClient), so their absence is a reliable "signed out" signal. A failed
  // fetch with tokens still present is a transient problem and must not be
  // treated as a logout.
  const shouldRedirect = !isPending && !isFetching && !user && !hasTokens;

  useEffect(() => {
    if (shouldRedirect) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [shouldRedirect, router, pathname]);

  if (isPending) return <AuthLoading />;
  // A background refetch (e.g. right after login/register/account switch)
  // may still hold the previous account's role. Don't flash AccessDenied —
  // wait for the fresh result. Genuinely unauthorized visits have no fetch
  // in flight, so they still see AccessDenied immediately.
  if (isFetching && !isAuthorized)
    return <AuthLoading label="Checking access..." />;
  if (shouldRedirect) return <AuthLoading label="Redirecting to login..." />;
  // Tokens exist but we could not load the profile: offer a retry rather
  // than bouncing to the login page over a network blip.
  if (isError) return <AuthError onRetry={() => refetch()} />;
  if (!user) return <AuthLoading label="Redirecting to login..." />;
  if (isAuthorized) return <>{children}</>;
  return <AccessDenied />;
}
