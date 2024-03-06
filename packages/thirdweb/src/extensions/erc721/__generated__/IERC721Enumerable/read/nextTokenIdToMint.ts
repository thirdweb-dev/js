import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "nextTokenIdToMint" function on the contract.
 * @param options - The options for the nextTokenIdToMint function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { nextTokenIdToMint } from "thirdweb/extensions/erc721";
 *
 * const result = await nextTokenIdToMint();
 *
 * ```
 */
export async function nextTokenIdToMint(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x3b1475a7",
      [],
      [
        {
          type: "uint256",
        },
      ],
    ],
    params: [],
  });
}
