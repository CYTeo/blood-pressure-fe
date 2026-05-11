import { NextResponse } from "next/server";

import { HttpMethod } from "./httpMethodType";
import { logger } from "./logger";
import {
  deleteTokens,
  getTokens,
  refreshTokensRequest,
  setTokens
} from "./tokenService";

type RequestOptions = {
  endpoint: string;
  httpMethod?: HttpMethod;
  contentType?: string;
  stringifyBody?: string;
  formData?: FormData;
  baseUrl?: string;
  retry?: boolean;
};

/**
 * The function allows external requests with automatic cookie accessToken management.
 * Note: If called from RSC, it can refresh the token in-memory for the current request, 
 * but cannot update the browser's cookies. Middleware is used to solve this proactively.
 */
export async function httpExternalRequest({
  endpoint,
  httpMethod = "GET",
  contentType = "application/json",
  stringifyBody,
  formData,
  baseUrl,
  retry = false,
}: RequestOptions): Promise<NextResponse> {
  const startTime = Date.now();
  const timeout = 10000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const { accessToken, refreshToken } = await getTokens();

  // 1. Build request options
  const isFormData = !!formData;
  const headers: HeadersInit = {
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  if (!isFormData && contentType) {
    headers["Content-Type"] = contentType;
  }
  const body = isFormData ? formData : stringifyBody;

  // 2. Make Request to external API
  const response = await fetch(endpoint, {
    method: httpMethod,
    headers,
    body,
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  logger({ endpoint, httpMethod, response, startTime });

  // 3. Get the response details
  let data = null;
  if (
    response.status !== 204 &&
    response.headers.get("content-length") !== "0"
  ) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }
  const bodyText = data ? JSON.stringify(data) : undefined;
  const responseHeaders = new Headers(response.headers);

  // 3.1 Handle Login endpoint: set tokens and return
  if (response.ok && endpoint.includes("signin")) {
    await setTokens(data);
    return new NextResponse(bodyText, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  }

  // 3.2 Handle Unauthorized (401): Attempt Refresh
  if (response.status === 401 && !retry && !endpoint.includes("login")) {
    if (refreshToken) {
      const { ok, data: freshTokens } = await refreshTokensRequest(refreshToken);

      if (!ok) {
        // Refresh failed, redirect to login
        await deleteTokens();
        return redirectToLogin();
      }

      // Refresh succeeded. Attempt to set tokens (will warn if RSC)
      await setTokens(freshTokens!);

      // Retry the original request with the NEW token
      return await httpExternalRequest({
        endpoint,
        httpMethod,
        stringifyBody,
        formData,
        baseUrl,
        retry: true, // Mark as retry to avoid loops
      });
    } else {
      // No refresh token available
      await deleteTokens();
      return redirectToLogin();
    }
  }

  // 3.3 Handle Logout: Clear tokens and redirect
  if (["logout", "signout"].includes(endpoint)) {
    await deleteTokens();
    return redirectToLogin();
  }

  // 4. Default Request handling
  return new NextResponse(bodyText || null, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

/**
 * Legacy helper for 401 Unauthorized redirect
 */
function redirectToLogin() {
  return NextResponse.json(
    { message: "Unauthorized", redirectTo: "/login" },
    { status: 307 }
  );
}

