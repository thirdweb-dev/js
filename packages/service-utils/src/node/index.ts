import { createHash } from "node:crypto";
import type {
  IncomingHttpHeaders,
  IncomingMessage,
  ServerResponse,
} from "node:http";
import type { CoreServiceConfig } from "../core/api.js";
import type {
  AuthorizationInput,
  CacheOptions,
} from "../core/authorize/index.js";
import { authorize } from "../core/authorize/index.js";
import type { AuthorizationResult } from "../core/authorize/types.js";
import type { CoreAuthInput } from "../core/types.js";

export * from "../core/rateLimit/index.js";
export * from "../core/services.js";
export * from "../core/usage.js";
export * from "../core/usageV2.js";
export * from "./kafka.js";
export * from "./usageV2.js";

type NodeServiceConfig = CoreServiceConfig;

export type AuthInput = CoreAuthInput & {
  req: IncomingMessage | Request;
};

export async function authorizeNode(
  authInput: AuthInput,
  serviceConfig: NodeServiceConfig,
  cacheOptions?: CacheOptions,
): Promise<AuthorizationResult> {
  let authData: AuthorizationInput;
  try {
    authData = extractAuthorizationData(authInput);
  } catch (e) {
    if (e instanceof Error && e.message === "KEY_CONFLICT") {
      return {
        authorized: false,
        errorCode: "KEY_CONFLICT",
        errorMessage: "Please pass either a client id or a secret key.",
        status: 400,
      };
    }
    return {
      authorized: false,
      errorCode: "INTERNAL_SERVER_ERROR",
      errorMessage: "Internal Server Error",
      status: 500,
    };
  }

  return await authorize(authData, serviceConfig, cacheOptions);
}

function isNodeHeaders(
  headers: IncomingHttpHeaders | Headers,
): headers is IncomingHttpHeaders {
  return typeof headers === "object" && !("get" in headers);
}

function getHeader(
  headers: IncomingHttpHeaders | Headers,
  headerName: string,
): string | null {
  return isNodeHeaders(headers)
    ? Array.isArray(headers[headerName])
      ? (headers[headerName]?.[0] ?? null)
      : (headers[headerName] ?? null)
    : (headers.get(headerName) ?? null);
}

export function extractAuthorizationData(
  authInput: AuthInput,
): AuthorizationInput {
  let requestUrl: URL;

  requestUrl = new URL(
    authInput.req.url || "",
    `http://${getHeader(authInput.req.headers, "host")}`,
  );

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

  let ecosystemId = getHeader(headers, "x-ecosystem-id");
  if (!ecosystemId) {
    ecosystemId = requestUrl.searchParams.get("ecosystemId");
  }

  let ecosystemPartnerId = getHeader(headers, "x-ecosystem-partner-id");
  if (!ecosystemPartnerId) {
    ecosystemPartnerId = requestUrl.searchParams.get("ecosystemPartnerId");
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
  }

  let jwt: null | string = null;
  let useWalletAuth: null | string = null;
  // check for authorization header on the request
  const authorizationHeader = getHeader(headers, "authorization");
  if (authorizationHeader) {
    const [type, token] = authorizationHeader.split(" ");
    if (type?.toLowerCase() === "bearer" && !!token) {
      jwt = token;
      const walletAuthHeader = getHeader(headers, "x-authorize-wallet");
      // IK a stringified boolean is not ideal, but it's required to pass it in the headers.
      if (walletAuthHeader?.toLowerCase() === "true") {
        useWalletAuth = walletAuthHeader;
      }
    }
  }

  let incomingServiceApiKey: string | null = null;
  let incomingServiceApiKeyHash: string | null = null;
  if (getHeader(headers, "x-service-api-key")) {
    incomingServiceApiKey = getHeader(headers, "x-service-api-key");
    if (incomingServiceApiKey) {
      incomingServiceApiKeyHash = hashSecretKey(incomingServiceApiKey);
    }
  }

  let teamId: string | null = null;
  if (getHeader(headers, "x-team-id")) {
    teamId = getHeader(headers, "x-team-id");
  }

  return {
    bundleId,
    clientId,
    ecosystemId,
    ecosystemPartnerId,
    hashedJWT: jwt ? hashSecretKey(jwt) : null,
    incomingServiceApiKey,
    incomingServiceApiKeyHash,
    jwt,
    origin,
    secretKey,
    secretKeyHash,
    targetAddress: authInput.targetAddress,
    teamId: authInput.teamId ?? teamId ?? undefined,
    useWalletAuth,
  };
}

export function hashSecretKey(secretKey: string) {
  return createHash("sha256").update(secretKey).digest("hex");
}

export function logHttpRequest({
  clientId,
  req,
  res,
  isAuthed,
  statusMessage,
  latencyMs,
}: AuthInput & {
  // @deprecated
  source: string;
  res: ServerResponse;
  isAuthed?: boolean;
  statusMessage?: Error | string;
  latencyMs?: number;
}) {
  try {
    const authorizationData = extractAuthorizationData({ clientId, req });
    const headers = req.headers;

    console.log(
      JSON.stringify({
        clientId: authorizationData.clientId,
        hasClientId: !!authorizationData.clientId,
        hasJwt: !!authorizationData.jwt,
        hasSecretKey: !!authorizationData.secretKey,
        isAuthed,
        latencyMs,
        method: req.method,
        os: getHeader(headers, "x-sdk-os"),
        pathname: req.url,
        platform: getHeader(headers, "x-sdk-platform"),
        sdkName: getHeader(headers, "x-sdk-name"),
        sdkVersion: getHeader(headers, "x-sdk-version"),
        status: res.statusCode,
        statusMessage,
      }),
    );
  } catch {}
}
