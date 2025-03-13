"use server";
import "server-only";
import type { PermissionState } from "@/components/permission-card";
import { SignJWT } from "jose";
import { redirect } from "next/navigation";
import { getLoginConfig } from "../api/login/config";
import { getKeyInfo } from "../lib/keys";
import type { Oauth2AuthorizeParams, Oauth2CodePayload } from "../lib/oauth";
import { getValidSessionToken } from "../lib/siwe-server";

export async function createCode(options: {
  permissions: PermissionState;
  oauthParams: Oauth2AuthorizeParams;
}) {
  // 1) check if the user is logged in
  const jwt = await getValidSessionToken();
  if (!jwt) {
    return {
      success: false,
      error: "User is not logged in",
    };
  }

  // 2) get the config for the client_id
  const config = await getLoginConfig(options.oauthParams.client_id);
  if (!config) {
    return {
      success: false,
      error: "Invalid client_id",
    };
  }

  // 3) TODO: validate redirect_uri against the config

  // 4) get the key info
  const { privateKey, alg } = await getKeyInfo();

  // 4) Create the authorization code as a short-lived JWT
  const now = Math.floor(Date.now() / 1000);
  const codeExpiresInSeconds = 60; // 60 seconds

  const codeJwt = await new SignJWT({
    sub: jwt.sub,
    scope: options.oauthParams.scope ?? "",
    client_id: options.oauthParams.client_id,
    code_challenge: options.oauthParams.code_challenge,
    code_challenge_method: options.oauthParams.code_challenge_method,
    redirect_uri: options.oauthParams.redirect_uri,
    permissions: options.permissions,
  } satisfies Oauth2CodePayload)
    .setProtectedHeader({ alg: alg, typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(now + codeExpiresInSeconds)
    .sign(privateKey);

  // 4) Redirect back to the client's redirectUri with the code and state
  const url = new URL(options.oauthParams.redirect_uri);
  url.searchParams.set("code", codeJwt);
  url.searchParams.set("state", options.oauthParams.state);

  // redirect the user to the client's redirectUri with the code and state
  redirect(url.toString());
}
