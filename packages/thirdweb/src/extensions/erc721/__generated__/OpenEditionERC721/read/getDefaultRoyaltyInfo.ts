import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "getDefaultRoyaltyInfo" function on the contract.
 * @param options - The options for the getDefaultRoyaltyInfo function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { getDefaultRoyaltyInfo } from "thirdweb/extensions/erc721";
 *
 * const result = await getDefaultRoyaltyInfo();
 *
 * ```
 */
export async function getDefaultRoyaltyInfo(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xb24f2d39",
      [],
      [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
    ],
    params: [],
  });
}
