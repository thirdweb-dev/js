import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "nextTokenIdToClaim" function on the contract.
 * @param options - The options for the nextTokenIdToClaim function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { nextTokenIdToClaim } from "thirdweb/extensions/erc721";
 *
 * const result = await nextTokenIdToClaim();
 *
 * ```
 */
export async function nextTokenIdToClaim(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xacd083f8",
      [],
      [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
    ],
    params: [],
  });
}
