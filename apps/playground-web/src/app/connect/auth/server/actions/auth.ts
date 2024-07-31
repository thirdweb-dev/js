"use server";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { cookies } from "next/headers";
import { type VerifyLoginPayloadParams, createAuth } from "thirdweb/auth";
import { generateAccount, privateKeyToAccount } from "thirdweb/wallets";

const privateKey = process.env.THIRDWEB_ADMIN_PRIVATE_KEY;

const thirdwebAuth = createAuth({
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
  adminAccount: privateKey
    ? privateKeyToAccount({ client: THIRDWEB_CLIENT, privateKey })
    : await generateAccount({ client: THIRDWEB_CLIENT }),
});

export const generatePayload = thirdwebAuth.generatePayload;

export async function login(payload: VerifyLoginPayloadParams) {
  const verifiedPayload = await thirdwebAuth.verifyPayload(payload);
  if (verifiedPayload.valid) {
    const jwt = await thirdwebAuth.generateJWT({
      payload: verifiedPayload.payload,
    });
    cookies().set("jwt", jwt);
  }
}

export async function isLoggedIn() {
  const jwt = cookies().get("jwt");
  if (!jwt?.value) {
    return false;
  }

  const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value });
  if (!authResult.valid) {
    return false;
  }
  return authResult;
}

export async function getAuthResult(jwtValue: string) {
  const authResult = await thirdwebAuth.verifyJWT({ jwt: jwtValue });
  if (!authResult.valid) {
    return false;
  }
  return authResult;
}

export async function logout() {
  cookies().delete("jwt");
}
