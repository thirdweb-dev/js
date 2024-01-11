import type { NetworkInput } from "../core/types";
import type { SDKOptions } from "../schema/sdk-options";
import { getSignerAndProvider } from "../constants/urls";
import type { providers } from "ethers";

export type GetChainIdParams = {
  network: NetworkInput;
  sdkOptions?: SDKOptions;
};

// weakmap because if we GC the provider somewhere else we don't need to hold onto the promise anymore
const CHAIN_ID_CACHE = new WeakMap<providers.Provider, Promise<number>>();

/**
 * A function that returns the chainId for a given network input + sdk options combination.
 * This function will cache the promise for the chainId so that it can be reused.
 * You can call this function multiple times with the same params and it will only make one request to the provider.
 *
 * @returns The ChainId
 * @internal
 */
export async function getChainId(params: GetChainIdParams) {
  const [, provider] = getSignerAndProvider(params.network, params.sdkOptions);

  let chainIdPromise: Promise<number>;
  // if we already have a promise for the chainId, use that
  if (CHAIN_ID_CACHE.has(provider)) {
    chainIdPromise = CHAIN_ID_CACHE.get(provider) as Promise<number>;
  } else {
    chainIdPromise = provider
      .getNetwork()
      // we only want the chainId
      .then((network) => network.chainId)
      .catch((err) => {
        // in the case where the provider fails we should remove the promise from the cache so we can try again
        CHAIN_ID_CACHE.delete(provider);
        // also re-throw the error so downstream can handle it
        throw err;
      });
    CHAIN_ID_CACHE.set(provider, chainIdPromise);
  }

  // finally await the promise (will resolve immediately if already in cache and resolved)
  return await chainIdPromise;
}
