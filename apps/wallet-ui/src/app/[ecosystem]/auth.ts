"use server";
import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  type GenerateLoginPayloadParams,
  type VerifyLoginPayloadParams,
  createAuth,
} from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";
import { client } from "../../lib/client";

const privateKey = process.env.THIRDWEB_ADMIN_PRIVATE_KEY || "";

if (!privateKey) {
  throw new Error("Missing THIRDWEB_ADMIN_PRIVATE_KEY in .env file.");
}

const thirdwebAuth = createAuth({
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
  adminAccount: privateKeyToAccount({ client, privateKey }),
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
      return redirect(redirectUrl);
    }
    return;
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
