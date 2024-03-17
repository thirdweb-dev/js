import { getContract, type ThirdwebContract } from "../../contract/contract.js";
import type { ThirdwebClient } from "../../client/client.js";
import { optimism } from "../../chains/chain-definitions/optimism.js";
import {
  BUNDLER_ADDRESS,
  ID_GATEWAY_ADDRESS,
  ID_REGISTRY_ADDRESS,
  KEY_GATEWAY_ADDRESS,
  STORAGE_REGISTRY_ADDRESS,
} from "./constants.js";
import type { Chain } from "../../chains/types.js";

/**
 * Represents the options to retrieve a Farcaster contract
 */
export type FarcasterContractOptions = {
  client: ThirdwebClient;
  chain?: Chain;
};

/**
 * Retrieves the IdGateway contract.
 * @param options - The thirdweb client and an optional custom chain.
 * @returns The IdGateway contract instance.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getIdGatway } from "thirdweb/extensions/farcaster";
 *
 * const idGateway = await getIdGateway({
 *  client,
 * });
 * ```
 */
export function getIdGateway(
  options: FarcasterContractOptions,
): ThirdwebContract {
  return getContract({
    client: options.client,
    address: ID_GATEWAY_ADDRESS,
    chain: options.chain ?? optimism,
  });
}

/**
 * Retrieves the IdRegistry contract.
 * @param options - The thirdweb client and an optional custom chain.
 * @returns The IdRegistry contract instance.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getIdRegistry } from "thirdweb/extensions/farcaster";
 *
 * const idRegistry = await getIdRegistry({
 *  client,
 * });
 * ```
 */
export function getIdRegistry(
  options: FarcasterContractOptions,
): ThirdwebContract {
  return getContract({
    client: options.client,
    address: ID_REGISTRY_ADDRESS,
    chain: options.chain ?? optimism,
  });
}

/**
 * Retrieves the KeyGateway contract.
 * @param options - The thirdweb client and an optional custom chain.
 * @returns The KeyGateway contract instance.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getKeyGateway } from "thirdweb/extensions/farcaster";
 *
 * const keyGateway = await getKeyGateway({
 *  client,
 * });
 * ```
 */
export function getKeyGateway(
  options: FarcasterContractOptions,
): ThirdwebContract {
  return getContract({
    client: options.client,
    address: KEY_GATEWAY_ADDRESS,
    chain: options.chain ?? optimism,
  });
}

/**
 * Retrieves the StorageRegistry contract.
 * @param options - The thirdweb client and an optional custom chain.
 * @returns The StorageRegistry contract instance.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getStorageRegistry } from "thirdweb/extensions/farcaster";
 *
 * const storageRegistry = await getStorageRegistry({
 *  client,
 * });
 * ```
 */
export function getStorageRegistry(
  options: FarcasterContractOptions,
): ThirdwebContract {
  return getContract({
    client: options.client,
    address: STORAGE_REGISTRY_ADDRESS,
    chain: options.chain ?? optimism,
  });
}

/**
 * Retrieves the Bundler contract.
 * @param options - The thirdweb client and an optional custom chain.
 * @returns The Bundler contract instance.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getBundler } from "thirdweb/extensions/farcaster";
 *
 * const bundler = await getBundler({
 *  client,
 * });
 * ```
 */
export function getBundler(
  options: FarcasterContractOptions,
): ThirdwebContract {
  return getContract({
    client: options.client,
    address: BUNDLER_ADDRESS,
    chain: options.chain ?? optimism,
  });
}
