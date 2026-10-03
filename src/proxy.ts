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
 * Why this proxy does NOT redirect unauthenticated users itself:
 * the backend sets its `accessToken` cookie as `SameSite=Lax`, so browsers
 * never send/store it on cross-site deployments (e.g. localhost or a
 * different Vercel host calling the API host). Auth tokens therefore live
 * in the client store (localStorage + Bearer header), which a proxy cannot
 * read. Authorization is enforced by the client-side RoleGuard (per-role)
 * and by backend RBAC on every endpoint.
 *
 * What the proxy DOES do:
 * - Keeps logged-in users (cookie present, e.g. same-site) away from
 *   /login and /register by bouncing them to `?next=` or their role
 *   dashboard.
 * - Lets RoleGuard handle all protected-route decisions otherwise, avoiding
 *   false redirect loops back to `/login?next=...`.
 */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage && accessToken) {
    const next = searchParams.get("next");
    const dest =
      next &&
      PROTECTED_PREFIXES.some((p) => next === p || next.startsWith(`${p}/`))
        ? next
        : (ROLE_HOME[roleFromToken(accessToken) ?? ""] ?? "/");
    return NextResponse.redirect(new URL(dest, request.url));
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
