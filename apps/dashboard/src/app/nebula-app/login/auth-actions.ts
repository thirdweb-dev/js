"use server";
import "server-only";

import { NEBULA_APP_SECRET_KEY, NEXT_PUBLIC_NEBULA_URL } from "@/constants/env";
import { isVercel } from "lib/vercel-utils";
import { cookies } from "next/headers";
import { getAddress } from "thirdweb";
import type {
  GenerateLoginPayloadParams,
  LoginPayload,
  VerifyLoginPayloadParams,
} from "thirdweb/auth";
import { verifyTurnstileToken } from "../../(app)/login/verifyTurnstileToken";
import {
  NEBULA_COOKIE_ACTIVE_ACCOUNT,
  NEBULA_COOKIE_PREFIX_TOKEN,
} from "../_utils/constants";

const FOURTEEN_DAYS_IN_SECONDS = 14 * 24 * 60 * 60;

export async function getNebulaLoginPayload(
  params: GenerateLoginPayloadParams,
): Promise<LoginPayload> {
  const res = await fetch(`${NEXT_PUBLIC_NEBULA_URL}/auth/delegate/payload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Secret-Key": NEBULA_APP_SECRET_KEY,
    },
    body: JSON.stringify({
      address: params.address,
      chain_id: params.chainId?.toString(),
    }),
  });

  if (!res.ok) {
    console.error("Failed to fetch login payload", await res.text());
    throw new Error("Failed to fetch login payload");
  }
  const data = await res.json();
  return data.result.payload as LoginPayload;
}

export async function doNebulaLogin(
  params:
    | {
        type: "nebula-app";
        loginPayload: VerifyLoginPayloadParams;
        turnstileToken: string | undefined;
      }
    | {
        type: "floating-chat";
        loginPayload: {
          payload: LoginPayload;
          token: string;
        };
      },
) {
  // only validate the turnstile token if we are in a vercel environment
  if (params.type === "nebula-app" && isVercel()) {
    if (!params.turnstileToken) {
      return {
        error: "Please complete the captcha.",
      };
    }

    const result = await verifyTurnstileToken(params.turnstileToken);
    if (!result.success) {
      return {
        error: "Invalid captcha. Please try again.",
        context: result.context,
      };
    }
  }

  const cookieStore = await cookies();

  // forward the request to the API server
  const res = await fetch(`${NEXT_PUBLIC_NEBULA_URL}/auth/delegate/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Secret-Key": NEBULA_APP_SECRET_KEY,
    },
    body: JSON.stringify(params.loginPayload),
  });

  // if the request failed, log the error and throw an error
  if (!res.ok) {
    try {
      // clear the cookies to prevent any weird issues
      cookieStore.delete(
        NEBULA_COOKIE_PREFIX_TOKEN +
          getAddress(params.loginPayload.payload.address),
      );
      cookieStore.delete(NEBULA_COOKIE_ACTIVE_ACCOUNT);
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

  const json = (await res.json()) as {
    result: {
      token: string;
    };
  };

  const jwt = json.result.token;

  if (!jwt) {
    console.error("Failed to login - invalid json", json);
    return {
      error: "Failed to login. Please try again later.",
    };
  }

  // set the token cookie
  cookieStore.set(
    NEBULA_COOKIE_PREFIX_TOKEN +
      getAddress(params.loginPayload.payload.address),
    jwt,
    {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: FOURTEEN_DAYS_IN_SECONDS,
    },
  );

  // set the active account cookie
  cookieStore.set(
    NEBULA_COOKIE_ACTIVE_ACCOUNT,
    getAddress(params.loginPayload.payload.address),
    {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: FOURTEEN_DAYS_IN_SECONDS,
    },
  );

  return {
    success: true,
    token: jwt,
  };
}

export async function doNebulaLogout() {
  const cookieStore = await cookies();
  // delete all cookies that start with the token prefix
  const allCookies = cookieStore.getAll();
  for (const cookie of allCookies) {
    if (cookie.name.startsWith(NEBULA_COOKIE_PREFIX_TOKEN)) {
      cookieStore.delete(cookie.name);
    }
  }
  // also delete the active account cookie
  cookieStore.delete(NEBULA_COOKIE_ACTIVE_ACCOUNT);
}

export async function isNebulaLoggedIn(address: string) {
  const cookieName = NEBULA_COOKIE_PREFIX_TOKEN + getAddress(address);
  const cookieStore = await cookies();
  // check if we have an access token
  const token = cookieStore.get(cookieName)?.value;
  if (!token) {
    return false;
  }

  const res = await fetch(`${NEXT_PUBLIC_NEBULA_URL}/auth/verify`, {
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
  cookieStore.set(NEBULA_COOKIE_ACTIVE_ACCOUNT, getAddress(address), {
    httpOnly: false,
    secure: true,
    sameSite: "strict",
    maxAge: FOURTEEN_DAYS_IN_SECONDS,
  });
  return true;
}
