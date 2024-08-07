"use server";
import "server-only";

import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAddress } from "thirdweb";
import type {
  GenerateLoginPayloadParams,
  LoginPayload,
  VerifyLoginPayloadParams,
} from "thirdweb/auth";

const THIRDWEB_API_HOST =
  process.env.NEXT_PUBLIC_THIRDWEB_API_HOST || "https://api.thirdweb.com";

export async function getLoginPayload(
  params: GenerateLoginPayloadParams,
): Promise<LoginPayload> {
  const res = await fetch(`${THIRDWEB_API_HOST}/v1/auth/payload`, {
    method: "POST",
    body: JSON.stringify({
      address: params.address,
      chainId: params.chainId?.toString(),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    console.error("Failed to fetch login payload", res.status, res.statusText);
    throw new Error("Failed to fetch login payload");
  }
  return (await res.json()).payload;
}

export async function doLogin(
  payload: VerifyLoginPayloadParams,
  nextPath?: string | null,
) {
  // forward the request to the API server
  const res = await fetch(`${THIRDWEB_API_HOST}/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload }),
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

  if (!json.token) {
    console.error("Failed to login - invalid json", json);
    throw new Error("Failed to login - invalid json");
  }

  // check if we have a thirdweb account for the token
  const userRes = await fetch(`${THIRDWEB_API_HOST}/v1/account/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${json.token}`,
    },
  });
  // if we do not have a user, create one
  if (userRes.status === 404) {
    const newUserRes = await fetch(`${THIRDWEB_API_HOST}/v1/account/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${json.token}`,
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
    json.token,
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

  // redirect to the nextPath (if set)
  if (nextPath && isValidRedirectPath(nextPath)) {
    return redirect(nextPath);
  }
  // if we do not have a next path, redirect to dashboard home
  return redirect("/dashboard");
}
function isValidRedirectPath(encodedPath: string): boolean {
  try {
    // Decode the URI component
    const decodedPath = decodeURIComponent(encodedPath);
    // ensure the path always starts with a _single_ slash
    // dobule slash could be interpreted as `//example.com` which is not allowed
    return decodedPath.startsWith("/") && !decodedPath.startsWith("//");
  } catch (e) {
    // If decoding fails, return false
    return false;
  }
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
  // if the address matches what we expect, we're logged in
  if (getAddress(json.address) === getAddress(address)) {
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

  // not logged in
  // clear the cookie
  cookieStore.delete(cookieName);
  return false;
}
