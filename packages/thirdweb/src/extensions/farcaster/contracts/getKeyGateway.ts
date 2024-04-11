import { optimism } from "../../../chains/chain-definitions/optimism.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { KEY_GATEWAY_ADDRESS } from "../constants.js";
import type { FarcasterContractOptions } from "./contractOptions.js";

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
