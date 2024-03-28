import { getSignerAndProvider } from "../../constants/urls";
import type { providers } from "ethers";

type CachedEns = {
  address: string | null;
  expirationTime: Date;
};

// TODO: Respect SDK RPC configuration and don't pull straight from ethers
let provider: providers.Provider | undefined;

const ENS_CACHE = new Map<string, Promise<CachedEns>>();

/**
 * @internal
 */
export async function resolveEns(
  ens: string,
  depth = 0,
): Promise<string | null> {
  if (!provider) {
    // if we don't already have a provider then get one
    provider = getSignerAndProvider("ethereum")[1];
  }
  let ensPromise: Promise<CachedEns>;

  if (ENS_CACHE.has(ens)) {
    ensPromise = ENS_CACHE.get(ens) as Promise<CachedEns>;
  } else {
    ensPromise = provider.resolveName(ens).then((address) => {
      // If they don't have an ENS, only cache for 30s
      if (!address) {
        return {
          address: null,
          expirationTime: new Date(Date.now() + 1000 * 30),
        };
      }

      // Cache ENS for 1 hour
      return {
        address,
        expirationTime: new Date(Date.now() + 1000 * 60 * 5),
      };
    });
  }

  const resolvedPromise = await ensPromise;
  if (resolvedPromise.expirationTime < new Date()) {
    // delete the cache if it's expired
    ENS_CACHE.delete(ens);
    // then call ourselves again to refresh the cache, but don't block on the result
    if (depth === 0) {
      resolveEns(ens, depth + 1);
    }
  }
  return resolvedPromise.address;
}
