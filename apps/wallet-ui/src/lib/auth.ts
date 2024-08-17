"use server";
import "server-only";
import { secp256k1 } from "@noble/curves/secp256k1";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { toHex } from "thirdweb";
import {
  type GenerateLoginPayloadParams,
  type VerifyLoginPayloadParams,
  createAuth,
} from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";
import { client } from "./client";

const privateKey = process.env.THIRDWEB_ADMIN_PRIVATE_KEY;

const thirdwebAuth = createAuth({
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
  client,
  // Fun little hack to make vercel happy at build time
  adminAccount: privateKeyToAccount({
    client,
    privateKey: privateKey || toHex(secp256k1.utils.randomPrivateKey()),
  }),
});

// We force this to be async so it can be a server action
export const generatePayload = async (params: GenerateLoginPayloadParams) =>
  thirdwebAuth.generatePayload(params);

export async function login(
  payload: VerifyLoginPayloadParams,
  redirectUrl?: string,
) {
  const verifiedPayload = await thirdwebAuth.verifyPayload(payload);
  if (verifiedPayload.valid) {
    const jwt = await thirdwebAuth.generateJWT({
      payload: verifiedPayload.payload,
    });
    cookies().set("jwt", jwt);
    if (redirectUrl) {
      redirect(redirectUrl);
    }
    return true;
  }
  return false;
}

export async function authedOnly() {
  const loggedIn = await getCurrentUser();
  if (loggedIn) {
    return;
  }
  redirect("/login");
}

export async function isLoggedIn(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

export async function getCurrentUser(): Promise<string | null> {
  const jwt = cookies().get("jwt");
  if (!jwt?.value) {
    return null;
  }

  const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value });
  if (!authResult.valid) {
    return null;
  }
  return authResult.parsedJWT.sub; // sub is the user's address
}

export async function logout() {
  cookies().delete("jwt");
}
