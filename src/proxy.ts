import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ROLE_HOME: Record<string, string> = {
  ADMIN: "/admin",
  COURIER: "/courier",
  CUSTOMER: "/dashboard",
};

const PROTECTED_PREFIXES = ["/admin", "/courier", "/dashboard"];

/**
 * Read the role claim out of a JWT without verifying it. Verification is
 * unnecessary here — this only picks a redirect destination for UX; the
 * client-side RoleGuard and backend RBAC enforce real authorization.
 * Works in both Edge and Node runtimes (no Buffer dependency).
 */
function roleFromToken(token: string): string | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes)) as {
      role?: unknown;
    };
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

/**
 * Next.js 16 route guard (proxy replaces the deprecated middleware convention).
 *
 * Hybrid enforcement (per B7A7 mandatory middleware requirement):
 * - `qd_auth` / `qd_role` are lightweight readable UX cookies synced by
 *   `useAuthStore` on login/logout (Edge cannot read localStorage).
 * - Real authorization stays in client-side RoleGuard + backend RBAC on every
 *   endpoint; the proxy only handles redirects to avoid false loops.
 *
 * What the proxy DOES do:
 * - Blocks unauthenticated visits to /admin, /courier, /dashboard/* by
 *   bouncing them to `/login?next=<pathname+search>`.
 * - Blocks role mismatch (e.g. CUSTOMER -> /admin) by redirecting to the
 *   caller's role home.
 * - Keeps logged-in users away from /login and /register by bouncing them
 *   to `?next=` (if permitted) or their role dashboard.
 */

function requiredRoleFor(pathname: string): string | null {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "ADMIN";
  if (pathname === "/courier" || pathname.startsWith("/courier/"))
    return "COURIER";
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/"))
    return "CUSTOMER";
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  // UX cookies synced from localStorage auth store (cross-site safe).
  const uxAuth = request.cookies.get("qd_auth")?.value;
  const uxRole = request.cookies.get("qd_role")?.value;
  const role = uxRole ?? (accessToken ? roleFromToken(accessToken) : null);
  const isAuthenticated = Boolean(accessToken ?? uxAuth);

  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage) {
    if (isAuthenticated) {
      const next = searchParams.get("next");
      const dest =
        next &&
        PROTECTED_PREFIXES.some((p) => next === p || next.startsWith(`${p}/`))
          ? next
          : (ROLE_HOME[role ?? ""] ?? "/");
      // Only honour ?next= when the caller's role may access it.
      if (next && role) {
        const need = requiredRoleFor(next);
        if (need && need !== role) {
          return NextResponse.redirect(
            new URL(ROLE_HOME[role] ?? "/", request.url),
          );
        }
      }
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  const need = requiredRoleFor(pathname);
  if (need) {
    if (!isAuthenticated) {
      const next = encodeURIComponent(pathname + request.nextUrl.search);
      return NextResponse.redirect(new URL(`/login?next=${next}`, request.url));
    }
    if (role && role !== need) {
      return NextResponse.redirect(
        new URL(ROLE_HOME[role] ?? "/login", request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/courier/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};

export { ROLE_HOME };
