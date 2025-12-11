import type { AsyncStorage } from "../utils/storage/AsyncStorage.js";
import type { RequestedPaymentPayload } from "./schemas.js";

/**
 * Cached permit signature data structure
 */
type CachedPermitSignature = {
  payload: RequestedPaymentPayload;
  deadline: string;
  maxAmount: string;
};

/**
 * Parameters for generating a permit cache key
 */
export type PermitCacheKeyParams = {
  chainId: number;
  asset: string;
  owner: string;
  spender: string;
};

const CACHE_KEY_PREFIX = "x402:permit";

/**
 * Generates a cache key for permit signature storage
 * @param params - The parameters to generate the cache key from
 * @returns The cache key string
 */
function getPermitCacheKey(params: PermitCacheKeyParams): string {
  return `${CACHE_KEY_PREFIX}:${params.chainId}:${params.asset.toLowerCase()}:${params.owner.toLowerCase()}:${params.spender.toLowerCase()}`;
}

/**
 * Retrieves a cached permit signature from storage
 * @param storage - The AsyncStorage instance to use
 * @param params - The parameters identifying the cached signature
 * @returns The cached signature data or null if not found
 */
export async function getPermitSignatureFromCache(
  storage: AsyncStorage,
  params: PermitCacheKeyParams,
): Promise<CachedPermitSignature | null> {
  try {
    const key = getPermitCacheKey(params);
    const cached = await storage.getItem(key);
    if (!cached) {
      return null;
    }
    return JSON.parse(cached) as CachedPermitSignature;
  } catch {
    return null;
  }
}

/**
 * Saves a permit signature to storage cache
 * @param storage - The AsyncStorage instance to use
 * @param params - The parameters identifying the signature
 * @param payload - The signed payment payload to cache
 * @param deadline - The deadline timestamp of the permit
 * @param maxAmount - The maximum amount authorized
 */
export async function savePermitSignatureToCache(
  storage: AsyncStorage,
  params: PermitCacheKeyParams,
  payload: RequestedPaymentPayload,
  deadline: string,
  maxAmount: string,
): Promise<void> {
  try {
    const key = getPermitCacheKey(params);
    const data: CachedPermitSignature = {
      payload,
      deadline,
      maxAmount,
    };
    await storage.setItem(key, JSON.stringify(data));
  } catch {
    // Silently fail - caching is optional
  }
}

/**
 * Clears a cached permit signature from storage
 * @param storage - The AsyncStorage instance to use
 * @param params - The parameters identifying the cached signature
 */
export async function clearPermitSignatureFromCache(
  storage: AsyncStorage,
  params: PermitCacheKeyParams,
): Promise<void> {
  try {
    const key = getPermitCacheKey(params);
    await storage.removeItem(key);
  } catch {
    // Silently fail
  }
}
