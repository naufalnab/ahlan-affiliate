import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const roleCookie = request.cookies.get("ahlan_demo_role")?.value;

  // Protect /admin routes
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (roleCookie !== "admin") {
      const loginUrl = new URL("/demo-login", request.url);
      loginUrl.searchParams.set("next", `${pathname}${search}`);
      loginUrl.searchParams.set("role", "admin");
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /affiliate routes
  if (pathname === "/affiliate" || pathname.startsWith("/affiliate/")) {
    if (roleCookie !== "affiliate") {
      const loginUrl = new URL("/demo-login", request.url);
      loginUrl.searchParams.set("next", `${pathname}${search}`);
      loginUrl.searchParams.set("role", "affiliate");
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /management routes
  if (pathname === "/management" || pathname.startsWith("/management/")) {
    if (roleCookie !== "management") {
      const loginUrl = new URL("/demo-login", request.url);
      loginUrl.searchParams.set("next", `${pathname}${search}`);
      loginUrl.searchParams.set("role", "management");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/affiliate",
    "/affiliate/:path*",
    "/management",
    "/management/:path*",
  ],
};
