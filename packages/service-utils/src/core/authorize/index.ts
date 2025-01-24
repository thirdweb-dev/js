import {
  type CoreServiceConfig,
  type TeamAndProjectResponse,
  fetchTeamAndProject,
} from "../api.js";
import { authorizeClient } from "./client.js";
import { authorizeService } from "./service.js";
import type { AuthorizationResult } from "./types.js";

export type AuthorizationInput = {
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
  // IMPORTANT: this is a stringified boolean! Only pass in true or false here. IK it's not ideal, but it's required to pass it in the headers.
  useWalletAuth?: string | null;
};

export type CacheOptions = {
  get: (clientId: string) => Promise<string | null>;
  put: (clientId: string, data: TeamAndProjectResponse) => Promise<void> | void;
  cacheTtlSeconds: number;
};

type TeamAndProjectCacheWithPossibleTTL =
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
  const cacheKey = authData.secretKeyHash
    ? `key-v2:secret-key:${authData.secretKeyHash}`
    : authData.hashedJWT
      ? `key-v2:dashboard-jwt:${authData.hashedJWT}`
      : authData.clientId
        ? `key-v2:client-id:${authData.clientId}`
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
        status: 500,
        errorMessage:
          "Failed to fetch key metadata. Please check your secret-key/clientId.",
        errorCode: "FAILED_TO_FETCH_KEY",
      };
    }
  }
  if (!teamAndProjectResponse) {
    return {
      authorized: false,
      status: 401,
      errorMessage: "Key is invalid. Please check your secret-key/clientId.",
      errorCode: "INVALID_KEY",
    };
  }
  // now we can validate the key itself
  const clientAuth = authorizeClient(authData, teamAndProjectResponse);

  if (!clientAuth.authorized) {
    return {
      errorCode: clientAuth.errorCode,
      authorized: false,
      status: 401,
      errorMessage: clientAuth.errorMessage,
    };
  }

  // if we've made it this far we need to check service specific authorization
  const serviceAuth = authorizeService(teamAndProjectResponse, serviceConfig);

  if (!serviceAuth.authorized) {
    return {
      errorCode: serviceAuth.errorCode,
      authorized: false,
      status: 403,
      errorMessage: serviceAuth.errorMessage,
    };
  }

  // if we reach this point we are authorized!
  return {
    authorized: true,
    team: teamAndProjectResponse.team,
    project: teamAndProjectResponse.project,
    authMethod: clientAuth.authMethod,
  };
}
