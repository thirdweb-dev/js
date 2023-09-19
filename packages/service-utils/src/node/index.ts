import { createHash } from "node:crypto";
import { authorize } from "../core/authorize";

import type { ServerResponse } from "http";
import type { IncomingHttpHeaders, IncomingMessage } from "node:http";
import type { CoreServiceConfig } from "../core/api";
import type { AuthorizationInput } from "../core/authorize";
import type { AuthorizationResult } from "../core/authorize/types";
import type { CoreAuthInput } from "../core/types";

export * from "../core/services";
export * from "../core/rateLimit";
export * from "../core/usageLimit";

type NodeServiceConfig = CoreServiceConfig;

export type AuthInput = CoreAuthInput & {
  req: IncomingMessage;
};

/**
 *
 * @param {AuthInput['req']} authInput.req - The incoming request from which information will be pulled from. These information includes (checks are in order and terminates on first match):
 * - clientId: Checks header `x-client-id`, search param `clientId`
 * - bundleId: Checks header `x-bundle-id`, search param `bundleId`
 * - secretKey: Checks header `x-secret-key`
 * - origin (the requesting domain): Checks header `origin`, `referer`
 * @param {AuthInput['clientId']} authInput.clientId - Overrides any clientId found on the `req` object
 * @param {AuthInput['targetAddress']} authInput.targetAddress - Only used in smart wallets to determine if the request is authorized to interact with the target address.
 * @param {NodeServiceConfig['enforceAuth']} serviceConfig - Always `true` unless you need to turn auth off. Tells the service whether or not to enforce auth.
 * @param {NodeServiceConfig['apiUrl']} serviceConfig.apiUrl - The url of the api server to fetch information for verification. `https://api.thirdweb.com` for production and `https://api.staging.thirdweb.com` for staging
 * @param {NodeServiceConfig['serviceApiKey']} serviceConfig.serviceApiKey - secret key to be used authenticate the caller of the api-server. Check the api-server's env variable for the keys.
 * @param {NodeServiceConfig['serviceScope']} serviceConfig.serviceScope - The service that we are requesting authorization for. E.g. `relayer`, `rpc`, 'bundler', 'storage' etc.
 * @param {NodeServiceConfig['serviceAction']} serviceConfig.serviceAction - Needed when the `serviceScope` is `storage`. Can be either `read` or `write`.
 * @param {NodeServiceConfig['useWalletAuth']} serviceConfig.useWalletAuth - If true it pings the `wallet/me` or else, `account/me`. You most likely can leave this as false.
 * @returns {AuthorizationResult} authorizationResult - contains if the request is authorized, and information about the account if it is authorized. Otherwise, it contains the error message and status code.
 */
export async function authorizeNode(
  authInput: AuthInput,
  serviceConfig: NodeServiceConfig,
): Promise<AuthorizationResult> {
  let authData: AuthorizationInput;
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

  let jwt: null | string = null;
  let useWalletAuth: null | string = null;
  // check for authorization header on the request
  const authorizationHeader = getHeader(headers, "authorization");
  if (authorizationHeader) {
    const [type, token] = authorizationHeader.split(" ");
    if (type.toLowerCase() === "bearer" && !!token) {
      jwt = token;
      const walletAuthHeader = getHeader(headers, "x-authorize-wallet");
      // IK a stringified boolean is not ideal, but it's required to pass it in the headers.
      if (walletAuthHeader?.toLowerCase() === "true") {
        useWalletAuth = walletAuthHeader;
      }
    }
  }

  return {
    jwt,
    hashedJWT: jwt ? hashSecretKey(jwt) : null,
    secretKeyHash,
    secretKey,
    clientId,
    origin,
    bundleId,
    targetAddress: authInput.targetAddress,
    useWalletAuth,
  };
}

export function hashSecretKey(secretKey: string) {
  return createHash("sha256").update(secretKey).digest("hex");
}

export function deriveClientIdFromSecretKeyHash(secretKeyHash: string) {
  return secretKeyHash.slice(0, 32);
}

export function logHttpRequest({
  source,
  clientId,
  req,
  res,
  isAuthed,
  statusMessage,
}: AuthInput & {
  source: string;
  res: ServerResponse;
  isAuthed?: boolean;
  statusMessage?: Error | string;
}) {
  try {
    const authorizationData = extractAuthorizationData({ req, clientId });
    const headers = req.headers;

    const _statusMessage = statusMessage ?? res.statusMessage;
    console.log(
      JSON.stringify({
        source,
        pathname: req.url,
        hasSecretKey: !!authorizationData.secretKey,
        hasClientId: !!authorizationData.clientId,
        hasJwt: !!authorizationData.jwt,
        clientId: authorizationData.clientId,
        isAuthed: !!isAuthed ?? null,
        status: res.statusCode,
        statusMessage: _statusMessage,
        sdkName: headers["x-sdk-name"] ?? "unknown",
        sdkVersion: headers["x-sdk-version"] ?? "unknown",
        platform: headers["x-sdk-platform"] ?? "unknown",
      }),
    );
    console.log(`statusMessage=${_statusMessage}`);
  } catch (err) {
    console.error("Failed to log HTTP request:", err);
  }
}
