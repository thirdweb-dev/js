import type { NetworkInput } from "../core/types";
import type { SDKOptions } from "../schema/sdk-options";
import { getSignerAndProvider } from "./getSignerAndProvider";
import type { providers } from "ethers";

export type GetChainIdParams = {
  network: NetworkInput;
  sdkOptions?: SDKOptions;
};

const CHAIN_ID_CACHE = new WeakMap<providers.Provider, Promise<number>>();

/**
 * gets the chainId of a given network + sdk options input and caches it for future calls
 *
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
