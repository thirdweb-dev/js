import type { IncomingHttpHeaders, IncomingMessage } from "node:http";
import { createHash } from "node:crypto";
import type { AuthorizationInput } from "../core/authorize";
import type { CoreServiceConfig } from "../core/api";
import { authorize } from "../core/authorize";
import type { AuthorizationResult } from "../core/authorize/types";
import type { CoreAuthInput } from "../core/types";

export * from "../core/services";

type NodeServiceConfig = CoreServiceConfig;

export type AuthInput = CoreAuthInput & {
  req: IncomingMessage;
};

export async function authorizeNode(
  authInput: AuthInput,
  serviceConfig: NodeServiceConfig,
): Promise<AuthorizationResult> {
  let authData;
  try {
    authData = extractAuthorizationData(authInput);
  } catch (e) {
    if (e instanceof Error && e.message === "KEY_CONFLICT") {
      return {
        authorized: false,
        status: 400,
        errorMessage: "Please pass either a client id or a secret key.",
        errorCode: "KEY_CONFLICT",
      };
    }
    return {
      authorized: false,
      status: 500,
      errorMessage: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
    };
  }

  return await authorize(authData, serviceConfig);
}

function getHeader(
  headers: IncomingHttpHeaders,
  headerName: string,
): string | null {
  const header = headers[headerName];
  if (Array.isArray(header)) {
    return header[0];
  }
  return header ?? null;
}

export function extractAuthorizationData(
  authInput: AuthInput,
): AuthorizationInput {
  let requestUrl;

  try {
    requestUrl = new URL(
      authInput.req.url || "",
      `http://${authInput.req.headers.host}`,
    );
  } catch (error) {
    console.log("** Node URL Error **", error);
    throw error;
  }

  const headers = authInput.req.headers;
  const secretKey = getHeader(headers, "x-secret-key");
  // prefer clientId that is explicitly passed in
  let clientId = authInput.clientId ?? null;

  if (!clientId) {
    // next preference is clientId from header
    clientId = getHeader(headers, "x-client-id");
  }

  // next preference is search param
  if (!clientId) {
    clientId = requestUrl.searchParams.get("clientId");
  }
  // bundle id from header is first preference
  let bundleId = getHeader(headers, "x-bundle-id");

  // next preference is search param
  if (!bundleId) {
    bundleId = requestUrl.searchParams.get("bundleId");
  }

  let origin = getHeader(headers, "origin");
  // if origin header is not available we'll fall back to referrer;
  if (!origin) {
    origin = getHeader(headers, "referer");
  }
  // if we have an origin at this point, normalize it
  if (origin) {
    try {
      origin = new URL(origin).host;
    } catch (e) {
      console.warn("failed to parse origin", origin, e);
    }
  }

  // handle if we a secret key is passed in the headers
  let secretKeyHash: string | null = null;
  if (secretKey) {
    // hash the secret key
    secretKeyHash = hashSecretKey(secretKey);
    // derive the client id from the secret key hash
    const derivedClientId = deriveClientIdFromSecretKeyHash(secretKeyHash);
    // if we already have a client id passed in we need to make sure they match
    if (clientId && clientId !== derivedClientId) {
      throw new Error("KEY_CONFLICT");
    }
    // otherwise set the client id to the derived client id (client id based off of secret key)
    clientId = derivedClientId;
  }

  return {
    secretKeyHash,
    secretKey,
    clientId,
    origin,
    bundleId,
    targetAddress: authInput.targetAddress,
  };
}

export function hashSecretKey(secretKey: string) {
  return createHash("sha256").update(secretKey).digest("hex");
}

export function deriveClientIdFromSecretKeyHash(secretKeyHash: string) {
  return secretKeyHash.slice(0, 32);
}
