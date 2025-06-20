import { optimism } from "../../../chains/chain-definitions/optimism.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../contract/contract.js";
import { ID_GATEWAY_ADDRESS } from "../constants.js";
import type { FarcasterContractOptions } from "./contractOptions.js";

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
    address: ID_GATEWAY_ADDRESS,
    chain: options.chain ?? optimism,
    client: options.client,
  });
}
