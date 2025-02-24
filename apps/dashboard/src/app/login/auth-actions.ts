"use server";
import "server-only";

import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { API_SERVER_URL, THIRDWEB_API_SECRET } from "@/constants/env";
import { ipAddress } from "@vercel/functions";
import { cookies, headers } from "next/headers";
import { getAddress } from "thirdweb";
import type {
  GenerateLoginPayloadParams,
  LoginPayload,
  VerifyLoginPayloadParams,
} from "thirdweb/auth";
import { isVercel } from "../../lib/vercel-utils";

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

export async function doLogin(
  payload: VerifyLoginPayloadParams,
  turnstileToken: string,
) {
  if (!THIRDWEB_API_SECRET) {
    throw new Error("API_SERVER_SECRET is not set");
  }

  // only validate the turnstile token if we are in a vercel environment
  if (isVercel()) {
    if (!turnstileToken) {
      return {
        error: "Please complete the captcha.",
      };
    }

    // get the request headers
    const requestHeaders = await headers();
    if (!requestHeaders) {
      return {
        error: "Failed to get request headers. Please try again.",
      };
    }
    // CF header, fallback to req.ip, then X-Forwarded-For
    const [ip, errors] = (() => {
      let ip: string | null = null;
      const errors: string[] = [];
      try {
        ip = requestHeaders.get("CF-Connecting-IP") || null;
      } catch (err) {
        console.error("failed to get IP address from CF-Connecting-IP", err);
        errors.push("failed to get IP address from CF-Connecting-IP");
      }
      if (!ip) {
        try {
          ip = ipAddress(requestHeaders) || null;
        } catch (err) {
          console.error(
            "failed to get IP address from ipAddress() function",
            err,
          );
          errors.push("failed to get IP address from ipAddress() function");
        }
      }
      if (!ip) {
        try {
          ip = requestHeaders.get("X-Forwarded-For");
        } catch (err) {
          console.error("failed to get IP address from X-Forwarded-For", err);
          errors.push("failed to get IP address from X-Forwarded-For");
        }
      }
      return [ip, errors];
    })();

    if (!ip) {
      return {
        error: "Could not get IP address. Please try again.",
        context: errors,
      };
    }

    // https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
    // Validate the token by calling the "/siteverify" API endpoint.
    const result = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
          remoteip: ip,
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const outcome = await result.json();
    if (!outcome.success) {
      return {
        error: "Invalid captcha. Please try again.",
      };
    }
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
      return {
        error: "Failed to login. Please try again later.",
      };
    } catch {
      // just log the basics
      console.error(
        "Failed to login - api call failed",
        res.status,
        res.statusText,
      );
    }
    return {
      error: "Failed to login. Please try again later.",
    };
  }

  const json = await res.json();

  const jwt = json.data.jwt;

  if (!jwt) {
    console.error("Failed to login - invalid json", json);
    return {
      error: "Failed to login. Please try again later.",
    };
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

  return {
    success: true,
  };
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
