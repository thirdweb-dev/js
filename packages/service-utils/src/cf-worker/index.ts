import type {
  ExecutionContext,
  KVNamespace,
  Request,
  Response,
} from "@cloudflare/workers-types";
import type { CoreServiceConfig, TeamAndProjectResponse } from "../core/api.js";
import type {
  AuthorizationInput,
  TeamAndProjectCacheWithPossibleTTL,
} from "../core/authorize/index.js";
import { authorize } from "../core/authorize/index.js";
import type { AuthorizationResult } from "../core/authorize/types.js";
import type { CoreAuthInput } from "../core/types.js";

export * from "../core/rateLimit/index.js";
export * from "../core/services.js";
export * from "../core/usageV2.js";
export * from "./usage.js";
export * from "./usageV2.js";

export type WorkerServiceConfig = CoreServiceConfig & {
  kvStore: KVNamespace;
  ctx: ExecutionContext;
  cacheTtlSeconds?: number;
};

const DEFAULT_CACHE_TTL_SECONDS = 60;

type AuthInput = CoreAuthInput & {
  req: Request;
};

export async function authorizeWorker(
  authInput: AuthInput,
  serviceConfig: WorkerServiceConfig,
): Promise<AuthorizationResult> {
  let authData: AuthorizationInput;
  try {
    authData = await extractAuthorizationData(authInput);
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

  return await authorize(authData, serviceConfig, {
    cacheTtlSeconds: serviceConfig.cacheTtlSeconds ?? DEFAULT_CACHE_TTL_SECONDS,
    get: async (clientId: string) => serviceConfig.kvStore.get(clientId),
    put: (clientId: string, teamAndProjectResponse: TeamAndProjectResponse) =>
      serviceConfig.ctx.waitUntil(
        serviceConfig.kvStore.put(
          clientId,
          JSON.stringify({
            teamAndProjectResponse,
            updatedAt: Date.now(),
          } satisfies TeamAndProjectCacheWithPossibleTTL),
          {
            expirationTtl:
              serviceConfig.cacheTtlSeconds &&
              serviceConfig.cacheTtlSeconds >= DEFAULT_CACHE_TTL_SECONDS
                ? serviceConfig.cacheTtlSeconds
                : DEFAULT_CACHE_TTL_SECONDS,
          },
        ),
      ),
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

  let ecosystemId = headers.get("x-ecosystem-id");
  if (!ecosystemId) {
    ecosystemId = requestUrl.searchParams.get("ecosystemId");
  }

  let ecosystemPartnerId = headers.get("x-ecosystem-partner-id");
  if (!ecosystemPartnerId) {
    ecosystemPartnerId = requestUrl.searchParams.get("ecosystemPartnerId");
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
  }

  let jwt: string | null = null;
  if (headers.has("authorization")) {
    const authHeader = headers.get("authorization");
    if (authHeader) {
      const [type, token] = authHeader.split(" ");
      if (type?.toLowerCase() === "bearer" && !!token) {
        jwt = token;
      }
    }
  }

  let incomingServiceApiKey: string | null = null;
  let incomingServiceApiKeyHash: string | null = null;
  if (headers.has("x-service-api-key")) {
    incomingServiceApiKey = headers.get("x-service-api-key");
    if (incomingServiceApiKey) {
      incomingServiceApiKeyHash = await hashSecretKey(incomingServiceApiKey);
    }
  }

  let teamId: string | null = null;
  if (headers.has("x-team-id")) {
    teamId = headers.get("x-team-id");
  }

  return {
    bundleId,
    clientId,
    ecosystemId,
    ecosystemPartnerId,
    hashedJWT: jwt ? await hashSecretKey(jwt) : null,
    incomingServiceApiKey,
    incomingServiceApiKeyHash,
    jwt,
    origin,
    secretKey,
    secretKeyHash,
    targetAddress: authInput.targetAddress,
    teamId: authInput.teamId ?? teamId ?? undefined,
  };
}

export async function hashSecretKey(secretKey: string) {
  return bufferToHex(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secretKey)),
  );
}

function bufferToHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

export async function logHttpRequest({
  clientId,
  req,
  res,
  isAuthed,
  statusMessage,
  latencyMs,
}: AuthInput & {
  // @deprecated
  source: string;
  res: Response;
  isAuthed?: boolean;
  statusMessage?: Error | string;
  latencyMs?: number;
}) {
  try {
    const authorizationData = await extractAuthorizationData({ clientId, req });
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
        os: headers.get("x-sdk-os") ?? undefined,
        pathname: req.url,
        platform: headers.get("x-sdk-platform") ?? undefined,
        sdkName: headers.get("x-sdk-name") ?? undefined,
        sdkVersion: headers.get("x-sdk-version") ?? undefined,
        status: res.status,
      }),
    );
    if (statusMessage) {
      console.log(`statusMessage=${statusMessage}`);
    }
  } catch {}
}
