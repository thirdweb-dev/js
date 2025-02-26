import "server-only";

import { cookies } from "next/headers";
import { createAuth } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";
import { initDevMode } from "./dev-mode";
import { thirdwebClient } from "./thirdweb-client";

initDevMode();

export const SESSION_EXPIRATION_TIME_SECONDS = 60 * 60 * 24 * 30; // 30 days

export const SESSION_COOKIE_NAME = "tw_session";

export const SIWE_AUTH = createAuth({
  domain: "login.thirdweb.com",
  client: thirdwebClient,

  adminAccount: privateKeyToAccount({
    // biome-ignore lint/style/noNonNullAssertion: we know this is set
    privateKey: process.env.AUTH_PKEY!,
    client: thirdwebClient,
  }),
  jwt: {
    expirationTimeSeconds: SESSION_EXPIRATION_TIME_SECONDS,
  },
});

export async function getValidSessionToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME);
  if (!token) {
    return null;
  }

  const result = await SIWE_AUTH.verifyJWT({
    jwt: token.value,
  });

  if (!result.valid) {
    return null;
  }

  return result.parsedJWT;
}
