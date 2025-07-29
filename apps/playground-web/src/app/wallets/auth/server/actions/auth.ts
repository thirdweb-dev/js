"use server";
import { cookies } from "next/headers";
import { getAddress } from "thirdweb";
import {
  createAuth,
  type GenerateLoginPayloadParams,
  type VerifyLoginPayloadParams,
} from "thirdweb/auth";
import { generateAccount, privateKeyToAccount } from "thirdweb/wallets";
import { THIRDWEB_CLIENT } from "@/lib/client";

const privateKey = process.env.THIRDWEB_ADMIN_PRIVATE_KEY;

const thirdwebAuth = createAuth({
  adminAccount: privateKey
    ? privateKeyToAccount({ client: THIRDWEB_CLIENT, privateKey })
    : await generateAccount({ client: THIRDWEB_CLIENT }),
  client: THIRDWEB_CLIENT,
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "thirdweb.com",
});

export async function generatePayload(options: GenerateLoginPayloadParams) {
  return thirdwebAuth.generatePayload(options);
}

export async function login(payload: VerifyLoginPayloadParams) {
  const verifiedPayload = await thirdwebAuth.verifyPayload(payload);
  if (verifiedPayload.valid) {
    const jwt = await thirdwebAuth.generateJWT({
      payload: verifiedPayload.payload,
    });
    (await cookies()).set("jwt", jwt);
  }
}

export async function isLoggedIn(address: string) {
  // if no address is passed then return false
  if (!address) {
    return false;
  }
  const jwt = (await cookies()).get("jwt");
  // if no jwt is found then return false
  if (!jwt?.value) {
    return false;
  }

  const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value });
  // if the JWT is not valid then return false
  if (!authResult.valid) {
    return false;
  }
  // if the address in the JWT does not match the address we are checking for then return false
  if (getAddress(authResult.parsedJWT.sub) !== getAddress(address)) {
    return false;
  }
  // we are logged in
  return true;
}

export async function getAuthResult(jwtValue: string) {
  const authResult = await thirdwebAuth.verifyJWT({ jwt: jwtValue });
  if (!authResult.valid) {
    return false;
  }
  return authResult;
}

export async function logout() {
  (await cookies()).delete("jwt");
}
