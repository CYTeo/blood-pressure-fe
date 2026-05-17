import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import {
  isTokenExpired,
  refreshTokensRequest,
} from "@/utils/apiHelper/tokenService";

const protectedRoutes = ["/blood-pressure", "/reminder", "/scanner", "/profile"];
const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const cookieStore = await cookies();

  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let response = NextResponse.next();

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  // 1. Proactive Token Refresh
  if (await isTokenExpired(accessToken)) {
    if (refreshToken) {
      console.log("[Middleware] Access token expired, attempting refresh...");
      const { ok, data } = await refreshTokensRequest(refreshToken);

      if (ok && data) {
        accessToken = data.accessToken;

        const options = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax" as const,
          path: "/",
        };

        // Update REQ headers for Downstream (RSC)
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("Authorization", `Bearer ${data.accessToken}`);

        // Create response with updated request headers
        response = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });

        // Update RES cookies for Browser
        response.cookies.set("accessToken", data.accessToken, options);
        response.cookies.set("refreshToken", data.refreshToken, options);

        console.log("[Middleware] Token refreshed successfully.");
      } else {
        console.warn("[Middleware] Token refresh failed.");
        accessToken = undefined; // Mark as invalidated
      }
    } else {
      accessToken = undefined; // No refresh token available, mark as invalidated
    }
  }

  // 2. Route Protection
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/login", req.url);
    // loginUrl.searchParams.set("from", path);
    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.cookies.delete("accessToken");
    redirectResponse.cookies.delete("refreshToken");
    return redirectResponse;
  }

  if (isPublicRoute && accessToken && !(await isTokenExpired(accessToken))) {
    return NextResponse.redirect(new URL("/blood-pressure", req.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
