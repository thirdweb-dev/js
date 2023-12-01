import {
  AccountMetadata,
  ApiKeyMetadata,
  CoreServiceConfig,
  fetchAccountFromApi,
  fetchKeyMetadataFromApi,
} from "../api";
import { authorizeClient } from "./client";
import { authorizeService } from "./service";
import { AuthorizationResult } from "./types";

export type AuthorizationInput = {
  secretKey: string | null;
  clientId: string | null;
  origin: string | null;
  bundleId: string | null;
  secretKeyHash: string | null;
  jwt: string | null;
  hashedJWT: string | null;
  targetAddress?: string | string[];
  // IMPORTANT: this is a stringified boolean! Only pass in true or false here. IK it's not ideal, but it's required to pass it in the headers.
  useWalletAuth?: string | null;
};

type CacheOptions = {
  get: (clientId: string) => Promise<string | null>;
  put: (
    clientId: string,
    data: ApiKeyMetadata | AccountMetadata,
  ) => Promise<void> | void;
  cacheTtlSeconds: number;
};

type ApiKeyCacheWithPossibleTTL =
  | {
    apiKeyMeta: ApiKeyMetadata;
    updatedAt: number;
  }
  | ApiKeyMetadata;

type AccountCacheWithPossibleTTL =
  | {
    apiKeyMeta: AccountMetadata;
    updatedAt: number;
  }
  | AccountMetadata;

export async function authorize(
  authData: AuthorizationInput,
  serviceConfig: CoreServiceConfig,
  cacheOptions?: CacheOptions,
): Promise<AuthorizationResult> {
  const { clientId, targetAddress, secretKeyHash, jwt, hashedJWT, useWalletAuth } = authData;
  const { enforceAuth } = serviceConfig;

  // BACKWARDS COMPAT: if auth not enforced and we don't have auth credentials bypass
  if (!enforceAuth && !clientId && !secretKeyHash) {
    return {
      authorized: true,
      apiKeyMeta: null,
      accountMeta: null,
    };
  }
  // if we come in with a JWT then we only check the account is valid
  if (jwt && hashedJWT) {
    let accountMeta: AccountMetadata | null = null;
    if (cacheOptions) {
      try {
        const cachedAccountInfo = await cacheOptions.get(hashedJWT);
        if (cachedAccountInfo) {
          const parsed = JSON.parse(
            cachedAccountInfo,
          ) as AccountCacheWithPossibleTTL;
          if ("updatedAt" in parsed) {
            // we want to compare the updatedAt time to the current time
            // if the difference is greater than the cacheTtl we want to ignore the cached data
            const now = Date.now();
            const diff = now - parsed.updatedAt;
            const cacheTtlMs = cacheOptions.cacheTtlSeconds * 1000;
            // only if the diff is less than the cacheTtl do we want to use the cached key
            if (diff < cacheTtlMs) {
              accountMeta = parsed.apiKeyMeta;
            }
          } else {
            accountMeta = parsed;
          }
        }
      } catch (err) {
        // ignore errors, proceed as if not in cache
      }
    }
    if (!accountMeta) {
      try {
        const { data, error } = await fetchAccountFromApi(jwt, serviceConfig, useWalletAuth?.toLowerCase() === "true");
        if (error) {
          return {
            authorized: false,
            errorCode: error.code,
            errorMessage: error.message,
            status: error.statusCode,
          };
        } else if (!data) {
          return {
            authorized: false,
            errorCode: "NO_ACCOUNT",
            errorMessage: "No error but also no account returned.",
            status: 500,
          };
        }
        accountMeta = data;
        if (cacheOptions) {
          await cacheOptions.put(hashedJWT, accountMeta);
        }
      } catch (err) {
        console.warn("failed to fetch account from api", err);
        return {
          authorized: false,
          status: 500,
          errorMessage: "Failed to get account information.",
          errorCode: "FAILED_TO_LOAD_ACCOUNT",
        };
      }
    }
    // if we still don't have an accountMeta at this point we can't authorize
    if (!accountMeta) {
      return {
        authorized: false,
        status: 401,
        errorMessage: "Missing account information.",
        errorCode: "MISSING_ACCOUNT",
      };
    }
    // otherwise we want to return early with the accountMeta
    return {
      authorized: true,
      apiKeyMeta: null,
      accountMeta,
    };
  }

  // if we don't have a client id at this point we can't authorize
  if (!clientId) {
    return {
      authorized: false,
      status: 401,
      errorMessage: "Missing clientId or secretKey.",
      errorCode: "MISSING_KEY",
    };
  }

  let apiKeyMeta: ApiKeyMetadata | null = null;
  // if we have cache options we want to check the cache first
  if (cacheOptions) {
    try {
      const cachedKey = await cacheOptions.get(clientId);
      if (cachedKey) {
        const parsed = JSON.parse(cachedKey) as ApiKeyCacheWithPossibleTTL;
        if ("updatedAt" in parsed) {
          // we want to compare the updatedAt time to the current time
          // if the difference is greater than the cacheTtl we want to ignore the cached data
          const now = Date.now();
          const diff = now - parsed.updatedAt;
          const cacheTtlMs = cacheOptions.cacheTtlSeconds * 1000;
          // only if the diff is less than the cacheTtl do we want to use the cached key
          if (diff < cacheTtlMs) {
            apiKeyMeta = parsed.apiKeyMeta;
          }
        } else {
          apiKeyMeta = parsed;
        }
      }
    } catch (err) {
      // ignore errors, proceed as if not in cache
    }
  }

  // if we don't have a cached key, fetch from the API
  if (!apiKeyMeta) {
    try {
      const { data, error } = await fetchKeyMetadataFromApi(
        clientId,
        serviceConfig,
      );
      if (error) {
        return {
          authorized: false,
          errorCode: error.code,
          errorMessage: error.message,
          status: error.statusCode,
        };
      } else if (!data) {
        return {
          authorized: false,
          errorCode: "NO_KEY",
          errorMessage: "No error but also no key returned.",
          status: 500,
        };
      }
      // if we have a key for sure then assign it
      apiKeyMeta = data;

      // cache the retrieved key if we have cache options
      if (cacheOptions) {
        // we await this always because it can be a promise or not
        await cacheOptions.put(clientId, data);
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
  if (!apiKeyMeta) {
    return {
      authorized: false,
      status: 401,
      errorMessage: "Key is invalid. Please check your secret-key/clientId.",
      errorCode: "INVALID_KEY",
    };
  }
  // now we can validate the key itself
  const clientAuth = authorizeClient(authData, apiKeyMeta);

  if (!clientAuth.authorized) {
    return {
      errorCode: clientAuth.errorCode,
      authorized: false,
      status: 401,
      errorMessage: clientAuth.errorMessage,
    };
  }

  // if we've made it this far we need to check service specific authorization
  const serviceAuth = authorizeService(apiKeyMeta, serviceConfig, {
    targetAddress,
  });

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
    apiKeyMeta,
    accountMeta: {
      id: apiKeyMeta.accountId,
      // TODO update this later
      name: "",
      limits: apiKeyMeta.limits,
      rateLimits: apiKeyMeta.rateLimits,
      usage: apiKeyMeta.usage,
      creatorWalletAddress: apiKeyMeta.creatorWalletAddress,
    },
  };
}
