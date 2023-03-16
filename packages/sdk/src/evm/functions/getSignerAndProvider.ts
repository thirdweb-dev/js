import { getChainProvider, getProviderFromRpcUrl } from "../constants/urls";
import type { NetworkInput } from "../core/types";
import type { SDKOptions } from "../schema/sdk-options";
import type { providers } from "ethers";
import type { Signer } from "ethers";

/**
 * util function to check for signer, ripped out of ethers Signer.isProvider
 *
 * @param value possible signer
 * @returns boolean if value is a signer
 * @internal
 */
export function isSigner(value: any): value is Signer {
  return !!(value && value._isSigner);
}

/**
 * util function to check for provider, ripped out of ethers providers.Provider.isProvider
 *
 * @param value possible provider
 * @returns boolean if value is a provider
 * @internal
 */
export function isProvider(value: any): value is providers.Provider {
  return !!(value && value._isProvider);
}

/**
 * @internal
 */
export function getSignerAndProvider(
  network: NetworkInput,
  options?: SDKOptions,
): [Signer | undefined, providers.Provider] {
  let signer: Signer | undefined;
  let provider: providers.Provider | undefined;

  if (isSigner(network)) {
    // Here, we have an ethers.Signer
    signer = network;
    if (network.provider) {
      provider = network.provider;
    }
  } else if (isProvider(network)) {
    // Here, we have an ethers.providers.Provider
    provider = network;
  } else {
    // Here, we must have a ChainOrRpcUrl, which is a chain name, chain id, rpc url, or chain config
    // All of which, getChainProvider can handle for us
    provider = getChainProvider(network, options);
  }

  if (options?.readonlySettings) {
    // If readonly settings are specified, then overwrite the provider
    provider = getProviderFromRpcUrl(
      options.readonlySettings.rpcUrl,
      options.readonlySettings.chainId,
    );
  }

  // At this point, if we don't have a provider, don't default to a random chain
  // Instead, just throw an error
  if (!provider) {
    if (signer) {
      throw new Error(
        "No provider passed to the SDK! Please make sure that your signer is connected to a provider!",
      );
    }

    throw new Error(
      "No provider found! Make sure to specify which network to connect to, or pass a signer or provider to the SDK!",
    );
  }

  return [signer, provider];
}
