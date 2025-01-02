import { optimism } from "../../../chains/chain-definitions/optimism.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { BUNDLER_ADDRESS } from "../constants.js";
import type { FarcasterContractOptions } from "./contractOptions.js";

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
