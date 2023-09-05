import type {
  ExecutionContext,
  KVNamespace,
  Response,
} from "@cloudflare/workers-types";
import type {
  ApiKeyMetadata,
  AccountMetadata,
  CoreServiceConfig,
} from "../core/api";
import { authorize } from "../core/authorize";

import type { Request } from "@cloudflare/workers-types";
import type { AuthorizationInput } from "../core/authorize";
import type { AuthorizationResult } from "../core/authorize/types";
import type { RateLimitResult } from "../core/rateLimit/types";
import type { CoreAuthInput } from "../core/types";
import { rateLimit } from "../core/rateLimit";

export * from "./usage";
export * from "../core/services";
export * from "../core/rateLimit";
export * from "../core/usageLimit";

export type WorkerServiceConfig = CoreServiceConfig & {
  kvStore: KVNamespace;
  ctx: ExecutionContext;
  cacheTtlSeconds?: number;
};

const DEFAULT_CACHE_TTL_SECONDS = 60;
// must be > DEFAULT_RATE_LIMIT_WINDOW_SECONDS
const DEFAULT_RATE_LIMIT_CACHE_TTL_SECONDS = 60;

type AuthInput = CoreAuthInput & {
  req: Request;
};

export async function authorizeWorker(
  authInput: AuthInput,
  serviceConfig: WorkerServiceConfig,
): Promise<AuthorizationResult> {
  let authData;
  try {
    authData = await extractAuthorizationData(authInput);
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

  return await authorize(authData, serviceConfig, {
    get: async (clientId: string) => serviceConfig.kvStore.get(clientId),
    put: (clientId: string, apiKeyMeta: ApiKeyMetadata | AccountMetadata) =>
      serviceConfig.ctx.waitUntil(
        serviceConfig.kvStore.put(
          clientId,
          JSON.stringify({
            updatedAt: Date.now(),
            apiKeyMeta,
          }),
          {
            expirationTtl:
              serviceConfig.cacheTtlSeconds &&
              serviceConfig.cacheTtlSeconds >= DEFAULT_CACHE_TTL_SECONDS
                ? serviceConfig.cacheTtlSeconds
                : DEFAULT_CACHE_TTL_SECONDS,
          },
        ),
      ),
    cacheTtlSeconds: serviceConfig.cacheTtlSeconds ?? DEFAULT_CACHE_TTL_SECONDS,
  });
}

export async function rateLimitWorker(
  authzResult: AuthorizationResult,
  serviceConfig: WorkerServiceConfig,
): Promise<RateLimitResult> {
  return await rateLimit(authzResult, serviceConfig, {
    get: async (bucketId: string) => serviceConfig.kvStore.get(bucketId),
    put: (bucketId: string, count: string) =>
      serviceConfig.kvStore.put(bucketId, count, {
        expirationTtl: DEFAULT_RATE_LIMIT_CACHE_TTL_SECONDS,
      }),
  });
}

export async function extractAuthorizationData(
  authInput: AuthInput,
): Promise<AuthorizationInput> {
  const requestUrl = new URL(authInput.req.url);
  const headers = authInput.req.headers;
  const secretKey = headers.get("x-secret-key");

  // prefer clientId that is explicitly passed in
  let clientId = authInput.clientId ?? null;

  if (!clientId) {
    // next preference is clientId from header
    clientId = headers.get("x-client-id");
  }

  // next preference is search param
  if (!clientId) {
    clientId = requestUrl.searchParams.get("clientId");
  }
  // bundle id from header is first preference
  let bundleId = headers.get("x-bundle-id");

  // next preference is search param
  if (!bundleId) {
    bundleId = requestUrl.searchParams.get("bundleId");
  }

  let origin = headers.get("origin");
  // if origin header is not available we'll fall back to referrer;
  if (!origin) {
    origin = headers.get("referer");
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
    secretKeyHash = await hashSecretKey(secretKey);
    // derive the client id from the secret key hash
    const derivedClientId = deriveClientIdFromSecretKeyHash(secretKeyHash);
    // if we already have a client id passed in we need to make sure they match
    if (clientId && clientId !== derivedClientId) {
      throw new Error("KEY_CONFLICT");
    }
    // otherwise set the client id to the derived client id (client id based off of secret key)
    clientId = derivedClientId;
  }

  let jwt: string | null = null;
  if (headers.has("authorization")) {
    const authHeader = headers.get("authorization");
    if (authHeader) {
      const [type, token] = authHeader.split(" ");
      if (type.toLowerCase() === "bearer" && !!token) {
        jwt = token;
      }
    }
  }

  return {
    jwt,
    hashedJWT: jwt ? await hashSecretKey(jwt) : null,
    secretKey,
    clientId,
    origin,
    bundleId,
    secretKeyHash,
    targetAddress: authInput.targetAddress,
  };
}

export async function hashSecretKey(secretKey: string) {
  return bufferToHex(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secretKey)),
  );
}

export function deriveClientIdFromSecretKeyHash(secretKeyHash: string) {
  return secretKeyHash.slice(0, 32);
}

function bufferToHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

export async function logHttpRequest({
  source,
  clientId,
  req,
  res,
  isAuthed,
  statusMessage,
}: AuthInput & {
  source: string;
  res: Response;
  isAuthed?: boolean;
  statusMessage?: Error | string;
}) {
  const authorizationData = await extractAuthorizationData({ req, clientId });
  const headers = req.headers;

  console.log(
    JSON.stringify({
      source,
      pathname: req.url,
      hasSecretKey: !!authorizationData.secretKey,
      hasClientId: !!authorizationData.clientId,
      hasJwt: !!authorizationData.jwt,
      clientId: authorizationData.clientId,
      isAuthed: !!isAuthed ?? null,
      status: res.status,
      sdkName: headers.get("x-sdk-name") ?? "unknown",
      sdkVersion: headers.get("x-sdk-version") ?? "unknown",
      platform: headers.get("x-sdk-platform") ?? "unknown",
    }),
  );
  console.log(`statusMessage=${statusMessage ?? res.statusText}`);
}
