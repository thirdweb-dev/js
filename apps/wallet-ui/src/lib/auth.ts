"use server";
import "server-only";
import { cookies } from "next/headers";
import {
  createAuth,
  type GenerateLoginPayloadParams,
  type VerifyLoginPayloadParams,
} from "thirdweb/auth";
import { privateKeyToAccount, randomPrivateKey } from "thirdweb/wallets";
import { redirect } from "@/lib/redirect";
import { client } from "./client";

const privateKey = process.env.THIRDWEB_ADMIN_PRIVATE_KEY;

const thirdwebAuth = createAuth({
  // Fun little hack to make vercel happy at build time
  adminAccount: privateKeyToAccount({
    client,
    privateKey: privateKey || randomPrivateKey(),
  }),
  client,
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
});

// We force this to be async so it can be a server action
export const generatePayload = async (params: GenerateLoginPayloadParams) =>
  thirdwebAuth.generatePayload(params);

export async function login(payload: VerifyLoginPayloadParams) {
  const verifiedPayload = await thirdwebAuth.verifyPayload(payload);
  if (verifiedPayload.valid) {
    const jwt = await thirdwebAuth.generateJWT({
      payload: verifiedPayload.payload,
    });
    (await cookies()).set({
      httpOnly: true,
      maxAge: 3600,
      name: "jwt",
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      value: jwt,
    });
    return true;
  }
  return false;
}

export async function authedOnly(ecosystemId: string) {
  const loggedIn = await isLoggedIn();
  if (loggedIn) {
    return;
  }

  redirect("/login", ecosystemId);
}

async function isLoggedIn(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

export async function getCurrentUser(): Promise<string | null> {
  const jwt = (await cookies()).get("jwt");
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
  (await cookies()).delete("jwt");
}
