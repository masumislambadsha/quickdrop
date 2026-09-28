import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ROLE_HOME: Record<string, string> = {
  ADMIN: "/admin",
  COURIER: "/courier",
  CUSTOMER: "/dashboard",
};

const PROTECTED = [
  { prefix: "/admin", roles: ["ADMIN"] },
  { prefix: "/courier", roles: ["COURIER"] },
  { prefix: "/dashboard", roles: ["CUSTOMER"] },
];

/**
 * Next.js 16 route guard (proxy replaces the deprecated middleware convention).
 * Cookie presence is a fast pre-check only — real authorization is enforced by
 * the backend API and the client-side RoleGuard.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  const matched = PROTECTED.find(
    (r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`),
  );
  if (!matched) return NextResponse.next();

  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/courier/:path*", "/dashboard/:path*"],
};

export { ROLE_HOME };
