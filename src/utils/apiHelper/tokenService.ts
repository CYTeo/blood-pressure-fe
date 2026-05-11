"use server"
import { cookies, headers } from "next/headers";

export type TokenData = {
  accessToken: string;
  refreshToken: string;
};

const API_BASE_URL = process.env.API_BASE_URL;

/**
 * Get tokens from cookies or Authorization header (for Middleware passing)
 */
export async function getTokens() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Fallback to Authorization header (useful for Middleware -> RSC communication)
  const authHeader = headerStore.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const bearerToken = authHeader.split(" ")[1];
    // If header has a token and cookie doesn't, or header token is different, prefer header
    if (bearerToken && (!accessToken || accessToken !== bearerToken)) {
      accessToken = bearerToken;
    }
  }

  return { accessToken, refreshToken };
}

/**
 * Set tokens in cookies.
 * NOTE: This will fail if called from a React Server Component (RSC) render.
 * It is meant for Route Handlers, Server Actions, or Middleware.
 */
export async function setTokens(data: TokenData) {
  try {
    const cookieStore = await cookies();
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    cookieStore.set("accessToken", data.accessToken, options);
    cookieStore.set("refreshToken", data.refreshToken, options);
    return true;
  } catch (error: any) {
    console.warn(`[tokenService] Failed to set cookies (likely RSC): ${error.message || error}`);
    return false;
  }
}

/**
 * Delete tokens from cookies.
 */
export async function deleteTokens() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return true;
  } catch (error: any) {
    console.warn(`[tokenService] Failed to delete cookies (likely RSC): ${error.message || error}`);
    return false;
  }
}

/**
 * Decode JWT and check if it's expired
 */
export async function isTokenExpired(token: string | undefined): Promise<boolean> {
  if (!token) return true;
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return true;
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const exp = decodedPayload.exp;
    if (!exp) return false; // If no exp, assume not expired

    // Check if expired (with 10-second buffer)
    return Date.now() >= exp * 1000 - 10000;
  } catch {
    return true;
  }
}

/**
 * Perform the refresh token request
 */
export async function refreshTokensRequest(refreshToken: string) {
  const endpoint = `${API_BASE_URL}/authentication/token/refresh`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: refreshToken }),
    });

    if (!response.ok) {
      return { ok: false, data: null };
    }

    const data: TokenData = await response.json();
    return { ok: true, data };
  } catch (error) {
    console.error("[tokenService] Refresh failed:", error);
    return { ok: false, data: null };
  }
}
