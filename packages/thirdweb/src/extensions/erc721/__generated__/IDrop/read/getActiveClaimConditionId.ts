import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0xc68907de",
  [],
  [
    {
      type: "uint256",
    },
  ],
] as const;

/**
 * Calls the "getActiveClaimConditionId" function on the contract.
 * @param options - The options for the getActiveClaimConditionId function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { getActiveClaimConditionId } from "thirdweb/extensions/erc721";
 *
 * const result = await getActiveClaimConditionId();
 *
 * ```
 */
export async function getActiveClaimConditionId(
  options: BaseTransactionOptions,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
