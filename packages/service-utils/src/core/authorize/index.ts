import {
  type CoreServiceConfig,
  fetchTeamAndProject,
  type TeamAndProjectResponse,
  type TeamResponse,
} from "../api.js";
import { authorizeClient } from "./client.js";
import { authorizeService } from "./service.js";
import type { AuthorizationResult } from "./types.js";

export type AuthorizationInput = {
  incomingServiceApiKey: string | null;
  incomingServiceApiKeyHash: string | null;
  secretKey: string | null;
  clientId: string | null;
  ecosystemId: string | null;
  ecosystemPartnerId: string | null;
  origin: string | null;
  bundleId: string | null;
  secretKeyHash: string | null;
  jwt: string | null;
  hashedJWT: string | null;
  targetAddress?: string | string[];
  teamId?: string;
  // IMPORTANT: this is a stringified boolean! Only pass in true or false here. IK it's not ideal, but it's required to pass it in the headers.
  useWalletAuth?: string | null;
};

export type CacheOptions = {
  get: (clientId: string) => Promise<string | null>;
  put: (clientId: string, data: TeamAndProjectResponse) => Promise<void> | void;
  cacheTtlSeconds: number;
};

export type TeamAndProjectCacheWithPossibleTTL =
  | {
      teamAndProjectResponse: TeamAndProjectResponse;
      updatedAt: number;
    }
  | TeamAndProjectResponse;

export async function authorize(
  authData: AuthorizationInput,
  serviceConfig: CoreServiceConfig,
  cacheOptions?: CacheOptions,
): Promise<AuthorizationResult> {
  let teamAndProjectResponse: TeamAndProjectResponse | null = null;

  // Use a separate cache key per auth method.
  const cacheKey = authData.incomingServiceApiKey
    ? // incoming service key + clientId case
      `key-v2:service-key:${authData.incomingServiceApiKeyHash}:${authData.clientId ?? "client_default"}`
    : authData.secretKeyHash
      ? // secret key case
        `key-v2:secret-key:${authData.secretKeyHash}`
      : authData.hashedJWT
        ? // dashboard jwt case
          `key-v2:dashboard-jwt:${authData.hashedJWT}:${authData.teamId ?? "team_default"}:${authData.clientId ?? "client_default"}`
        : authData.clientId
          ? // clientId case
            `key-v2:client-id:${authData.clientId}`
          : null;

  // TODO if we have cache options we want to check the cache first
  if (cacheOptions && cacheKey) {
    try {
      const cachedValue = await cacheOptions.get(cacheKey);
      if (cachedValue) {
        const parsed = JSON.parse(
          cachedValue,
        ) as TeamAndProjectCacheWithPossibleTTL;
        if ("updatedAt" in parsed) {
          // we want to compare the updatedAt time to the current time
          // if the difference is greater than the cacheTtl we want to ignore the cached data
          const now = Date.now();
          const diff = now - parsed.updatedAt;
          const cacheTtlMs = cacheOptions.cacheTtlSeconds * 1000;
          // only if the diff is less than the cacheTtl do we want to use the cached key
          if (diff < cacheTtlMs) {
            teamAndProjectResponse = parsed.teamAndProjectResponse;
          }
        } else {
          teamAndProjectResponse = parsed;
        }
      }
    } catch {
      // ignore errors, proceed as if not in cache
    }
  }

  // if we don't have a cached key, fetch from the API
  if (!teamAndProjectResponse) {
    try {
      const { data, error } = await fetchTeamAndProject(
        authData,
        serviceConfig,
      );
      if (error) {
        return {
          authorized: false,
          errorCode: error.code,
          errorMessage: error.message,
          status: error.statusCode,
        };
      }
      if (!data) {
        return {
          authorized: false,
          errorCode: "NO_KEY",
          errorMessage: "No error but also no key returned.",
          status: 500,
        };
      }
      // if we have a key for sure then assign it
      teamAndProjectResponse = data;

      // cache the retrieved key if we have cache options
      if (cacheOptions && cacheKey) {
        // we await this always because it can be a promise or not
        await cacheOptions.put(cacheKey, data);
      }
    } catch (err) {
      console.warn("failed to fetch key metadata from api", err);
      return {
        authorized: false,
        errorCode: "FAILED_TO_FETCH_KEY",
        errorMessage:
          "Failed to fetch key metadata. Please check your secret-key/clientId.",
        status: 500,
      };
    }
  }
  if (!teamAndProjectResponse) {
    return {
      authorized: false,
      errorCode: "INVALID_KEY",
      errorMessage: "Key is invalid. Please check your secret-key/clientId.",
      status: 401,
    };
  }
  // check if the service is maybe disabled for the team (usually due to a billing issue / exceeding the free plan limit)
  if (
    !isServiceEnabledForTeam(
      serviceConfig.serviceScope,
      teamAndProjectResponse.team.capabilities,
    )
  ) {
    return {
      authorized: false,
      errorCode: "SERVICE_TEMPORARILY_DISABLED",
      errorMessage:
        "You currently do not have access to this service. Please check if your subscription includes this service and is active.",
      status: 403,
    };
  }
  // now we can validate the key itself
  const clientAuth = authorizeClient(authData, teamAndProjectResponse);

  if (!clientAuth.authorized) {
    return {
      authorized: false,
      errorCode: clientAuth.errorCode,
      errorMessage: clientAuth.errorMessage,
      status: 401,
    };
  }

  // if we've made it this far we need to check service specific authorization
  const serviceAuth = authorizeService(teamAndProjectResponse, serviceConfig);

  if (!serviceAuth.authorized) {
    return {
      authorized: false,
      errorCode: serviceAuth.errorCode,
      errorMessage: serviceAuth.errorMessage,
      status: 403,
    };
  }

  // if we reach this point we are authorized!
  return {
    authMethod: clientAuth.authMethod,
    authorized: true,
    project: teamAndProjectResponse.project,
    team: teamAndProjectResponse.team,
  };
}

function isServiceEnabledForTeam(
  scope: CoreServiceConfig["serviceScope"],
  teamCapabilities: TeamResponse["capabilities"],
): boolean {
  switch (scope) {
    case "rpc":
      return teamCapabilities.rpc.enabled;
    case "bundler":
      return teamCapabilities.bundler.enabled;
    case "storage":
      return teamCapabilities.storage.enabled;
    case "insight":
      return teamCapabilities.insight.enabled;
    case "nebula":
      return teamCapabilities.nebula.enabled;
    case "embeddedWallets":
      return teamCapabilities.embeddedWallets.enabled;
    default:
      // always return true for any legacy / un-named services
      return true;
  }
}
