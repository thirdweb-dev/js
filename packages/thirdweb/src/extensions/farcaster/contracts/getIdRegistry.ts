import { optimism } from "../../../chains/chain-definitions/optimism.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { ID_REGISTRY_ADDRESS } from "../constants.js";
import type { FarcasterContractOptions } from "./contractOptions.js";

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
