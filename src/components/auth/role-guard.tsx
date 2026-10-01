"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetMe } from "@/hooks";
import type { UserRole } from "@/types";
import AccessDenied from "./access-denied";
import AuthLoading from "./auth-loading";

interface RoleGuardProps {
  children: ReactNode;
  roles: UserRole[];
}

export default function RoleGuard({ children, roles }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isPending, isFetching, isError } = useGetMe();
  const user = data?.data;
  const isAuthorized = !!user && roles.includes(user.role);

  useEffect(() => {
    if (isPending || isFetching) return;
    if (isError || !user)
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [isPending, isFetching, isError, user, router, pathname]);

  if (isPending) return <AuthLoading />;
  // A background refetch (e.g. right after login/register/account switch)
  // may still hold the previous account's role. Don't flash AccessDenied —
  // wait for the fresh result. Genuinely unauthorized visits have no fetch
  // in flight, so they still see AccessDenied immediately.
  if (isFetching && !isAuthorized)
    return <AuthLoading label="Checking access..." />;
  if (isError || !user) return <AuthLoading label="Redirecting to login..." />;
  if (isAuthorized) return <>{children}</>;
  return <AccessDenied />;
}
