import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

// Protected routes configuration
const PROTECTED_ROUTES = ["/dashboard", "/security", "/admin"];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  "/security": ["security", "admin", "super_admin"],
  "/admin": ["admin", "super_admin"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const session = await verifyToken(token);

  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  // Check Role-Based Access Control (RBAC)
  const allowedRoles = Object.keys(ROLE_PERMISSIONS).find((route) =>
    pathname.startsWith(route)
  );

  if (allowedRoles) {
    const requiredRoles = ROLE_PERMISSIONS[allowedRoles];
    if (!requiredRoles.includes(session.role)) {
      // Redirect unauthorized role to resident dashboard
      const dashboardUrl = new URL("/dashboard", req.url);
      dashboardUrl.searchParams.set("error", "unauthorized_role");
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Pass request headers with user details
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", session.userId);
  requestHeaders.set("x-user-role", session.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/dashboard/:path*", "/security/:path*", "/admin/:path*"],
};
