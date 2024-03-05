import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "claimCondition" function on the contract.
 * @param options - The options for the claimCondition function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { claimCondition } from "thirdweb/extensions/erc721";
 *
 * const result = await claimCondition();
 *
 * ```
 */
export async function claimCondition(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xd637ed59",
      [],
      [
        {
          internalType: "uint256",
          name: "currentStartId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "count",
          type: "uint256",
        },
      ],
    ],
    params: [],
  });
}
