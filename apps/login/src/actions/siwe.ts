"use server";
import "server-only";

import { initDevMode } from "@/lib/dev-mode";
import { cookies } from "next/headers";
import { getAddress } from "thirdweb";
import type {
  GenerateLoginPayloadParams,
  VerifyLoginPayloadParams,
} from "thirdweb/auth";
import {
  SESSION_COOKIE_NAME,
  SESSION_EXPIRATION_TIME_SECONDS,
  getValidSessionToken,
} from "../lib/siwe-server";
import { SIWE_AUTH } from "../lib/siwe-server";

initDevMode();

export async function getLoginPayload(options: GenerateLoginPayloadParams) {
  return SIWE_AUTH.generatePayload(options);
}

export async function doLogin(params: VerifyLoginPayloadParams) {
  const result = await SIWE_AUTH.verifyPayload(params);
  if (!result.valid) {
    throw new Error(result.error);
  }

  const cookieStore = await cookies();

  // create a session token
  const token = await SIWE_AUTH.generateJWT(result);
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_EXPIRATION_TIME_SECONDS,
  });
}

export async function doLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isLoggedIn(address: string) {
  const jwt = await getValidSessionToken();
  if (!jwt) {
    return false;
  }

  try {
    return getAddress(jwt.sub) === getAddress(address);
  } catch {
    return false;
  }
}
