import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { ReleasableParams } from "../__generated__/Split/read/releasable.js";

export type ReleasableByTokenParams = ReleasableParams & {
  tokenAddress: string;
};

/**
 * Calls the "releasable" function on the contract.
 * @param options - The options for the releasable function.
 * @returns The parsed result of the function call.
 * @extension SPLIT
 * @example
 * ```ts
 * import { releasableByToken } from "thirdweb/extensions/split";
 *
 * const result = await releasableByToken({
 *  contract,
 *  account: ...,
 * });
 *
 * ```
 */
export async function releasableByToken(
  options: BaseTransactionOptions<ReleasableByTokenParams>,
) {
  return readContract({
    method:
      "function releasable(address token, address account) view returns (uint256)",
    params: [options.tokenAddress, options.account],
    ...options,
  });
}
