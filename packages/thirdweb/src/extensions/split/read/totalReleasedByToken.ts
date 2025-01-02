import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";

/**
 * Calls the "totalReleased" function on the contract.
 * Similar to the `release` extension, however this one requires you to specify a tokenAddress
 *
 * @param options - The options for the totalReleased function.
 * @returns The parsed result of the function call.
 * @extension SPLIT
 * @example
 * ```ts
 * import { totalReleasedByToken } from "thirdweb/extensions/split";
 *
 * const result = await totalReleasedByToken({
 *  contract,
 *  tokenAddress: "0x...",
 * });
 *
 * ```
 */
export async function totalReleasedByToken(
  options: BaseTransactionOptions<{ tokenAddress: string }>,
) {
  return readContract({
    contract: options.contract,
    method: "function totalReleased(address token) view returns (uint256)",
    params: [options.tokenAddress],
  });
}
