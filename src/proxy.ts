import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";
import { ADMIN_COOKIE_NAME, ADMIN_ROUTES } from "./lib/admin/constants";

const intlMiddleware = createMiddleware(routing);

const secret = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET ?? "dev-only-insecure-secret",
  );

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle /admins routes
  if (pathname === "/admins" || pathname.startsWith("/admins/")) {
    // Exclude API routes and login page from redirect logic
    if (pathname.startsWith("/admins/api/") || pathname === "/admins/login") {
      return NextResponse.next();
    }

    const cookie = request.cookies.get(ADMIN_COOKIE_NAME);
    if (cookie?.value) {
      // Has session cookie, try to verify
      try {
        const { payload } = await jwtVerify(cookie.value, secret(), {
          algorithms: ["HS256"],
        });
        if (payload.sub) {
          // Valid token - allow access to admin pages
          // If at root /admins, redirect to dashboard
          if (pathname === "/admins") {
            return NextResponse.redirect(new URL(`${ADMIN_ROUTES.dashboard}`, request.url));
          }
          return NextResponse.next();
        }
      } catch {
        // Invalid token, fall through to login
      }
    }
    // No valid token - redirect to login
    return NextResponse.redirect(new URL(`${ADMIN_ROUTES.login}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(fa|en|tr|ru)/:path*",
    "/admins/:path*",
  ],
};