"use server";
import "server-only";

import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { API_SERVER_URL } from "@/constants/env";
import { cookies } from "next/headers";
import { getAddress } from "thirdweb";
import type {
  GenerateLoginPayloadParams,
  LoginPayload,
  VerifyLoginPayloadParams,
} from "thirdweb/auth";

const THIRDWEB_API_SECRET = process.env.API_SERVER_SECRET || "";

export async function getLoginPayload(
  params: GenerateLoginPayloadParams,
): Promise<LoginPayload> {
  if (!THIRDWEB_API_SECRET) {
    throw new Error("API_SERVER_SECRET is not set");
  }
  const res = await fetch(`${API_SERVER_URL}/v2/siwe/payload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-service-api-key": THIRDWEB_API_SECRET,
    },
    body: JSON.stringify({
      address: params.address,
      chainId: params.chainId?.toString(),
    }),
  });

  if (!res.ok) {
    console.error("Failed to fetch login payload", res.status, res.statusText);
    throw new Error("Failed to fetch login payload");
  }
  return (await res.json()).data.payload;
}

export async function doLogin(payload: VerifyLoginPayloadParams) {
  if (!THIRDWEB_API_SECRET) {
    throw new Error("API_SERVER_SECRET is not set");
  }

  const cookieStore = await cookies();
  const utmCookies = cookieStore
    .getAll()
    .filter((cookie) => {
      return cookie.name.startsWith("utm_");
    })
    .reduce(
      (acc, cookie) => {
        acc[cookie.name] = cookie.value;
        return acc;
      },
      {} as Record<string, string>,
    );

  // forward the request to the API server
  const res = await fetch(`${API_SERVER_URL}/v2/siwe/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-service-api-key": THIRDWEB_API_SECRET,
    },
    // set the createAccount flag to true to create a new account if it does not exist
    body: JSON.stringify({ ...payload, createAccount: true, utm: utmCookies }),
  });

  // if the request failed, log the error and throw an error
  if (!res.ok) {
    try {
      // clear the cookies to prevent any weird issues
      cookieStore.delete(
        COOKIE_PREFIX_TOKEN + getAddress(payload.payload.address),
      );
      cookieStore.delete(COOKIE_ACTIVE_ACCOUNT);
    } catch {
      // ignore any errors on this
    }
    try {
      const response = await res.text();
      // try to log the rich error message
      console.error(
        "Failed to login - api call failed:",
        res.status,
        res.statusText,
        response,
      );
      throw new Error("Failed to login - api call failed");
    } catch {
      // just log the basics
      console.error(
        "Failed to login - api call failed",
        res.status,
        res.statusText,
      );
    }
    throw new Error("Failed to login - api call failed");
  }

  const json = await res.json();

  const jwt = json.data.jwt;

  if (!jwt) {
    console.error("Failed to login - invalid json", json);
    throw new Error("Failed to login - invalid json");
  }

  // set the token cookie
  cookieStore.set(
    COOKIE_PREFIX_TOKEN + getAddress(payload.payload.address),
    jwt,
    {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      // 3 days
      maxAge: 3 * 24 * 60 * 60,
    },
  );

  // set the active account cookie
  cookieStore.set(COOKIE_ACTIVE_ACCOUNT, getAddress(payload.payload.address), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    // 3 days
    maxAge: 3 * 24 * 60 * 60,
  });
}

export async function doLogout() {
  const cookieStore = await cookies();
  // delete all cookies that start with the token prefix
  const allCookies = cookieStore.getAll();
  for (const cookie of allCookies) {
    if (cookie.name.startsWith(COOKIE_PREFIX_TOKEN)) {
      cookieStore.delete(cookie.name);
    }
  }
  // also delete the active account cookie
  cookieStore.delete(COOKIE_ACTIVE_ACCOUNT);
}

export async function isLoggedIn(address: string) {
  const cookieName = COOKIE_PREFIX_TOKEN + getAddress(address);
  const cookieStore = await cookies();
  // check if we have an access token
  const token = cookieStore.get(cookieName)?.value;
  if (!token) {
    return false;
  }

  const res = await fetch(`${API_SERVER_URL}/v1/account/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error(
      "Failed to check if logged in - api call failed",
      res.status,
      res.statusText,
    );
    // not logged in
    // clear the cookie
    cookieStore.delete(cookieName);
    return false;
  }
  const json = await res.json();

  if (!json) {
    // not logged in
    // clear the cookie
    cookieStore.delete(cookieName);
    return false;
  }

  // set the active account cookie again
  cookieStore.set(COOKIE_ACTIVE_ACCOUNT, getAddress(address), {
    httpOnly: false,
    secure: true,
    sameSite: "strict",
    // 3 days
    maxAge: 3 * 24 * 60 * 60,
  });
  return true;
}
