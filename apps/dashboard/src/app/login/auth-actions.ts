"use server";
import "server-only";

import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { cookies } from "next/headers";
import { getAddress } from "thirdweb";
import type {
  GenerateLoginPayloadParams,
  LoginPayload,
  VerifyLoginPayloadParams,
} from "thirdweb/auth";

const THIRDWEB_API_HOST =
  process.env.NEXT_PUBLIC_THIRDWEB_API_HOST || "https://api.thirdweb.com";

const THIRDWEB_API_SECRET = process.env.API_SERVER_SECRET || "";

export async function getLoginPayload(
  params: GenerateLoginPayloadParams,
): Promise<LoginPayload> {
  if (!THIRDWEB_API_SECRET) {
    throw new Error("API_SERVER_SECRET is not set");
  }
  const res = await fetch(`${THIRDWEB_API_HOST}/v2/siwe/payload`, {
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

  // forward the request to the API server
  const res = await fetch(`${THIRDWEB_API_HOST}/v2/siwe/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-service-api-key": THIRDWEB_API_SECRET,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
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

  // check if we have a thirdweb account for the token
  const userRes = await fetch(`${THIRDWEB_API_HOST}/v1/account/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
  // if we do not have a user, create one
  // TODO: this should only need to check for 404, but because of secretKey auth it can also be 400 error
  if (userRes.status === 404 || userRes.status === 400) {
    const newUserRes = await fetch(`${THIRDWEB_API_HOST}/v1/account/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (newUserRes.status !== 200) {
      console.error(
        "Failed to create new user",
        newUserRes.status,
        newUserRes.statusText,
      );
      throw new Error("Failed to create new user");
    }
  }

  const cookieStore = cookies();

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
  const cookieStore = cookies();
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
  const cookieStore = cookies();
  // check if we have an access token
  const token = cookieStore.get(cookieName)?.value;
  if (!token) {
    return false;
  }

  const res = await fetch(`${THIRDWEB_API_HOST}/v1/account/me`, {
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
