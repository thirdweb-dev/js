import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

/**
 * Calls the totalListings function on the contract.
 * @param options - The options for the totalListings function.
 * @returns The parsed result of the function call.
 * @extension IDIRECTLISTINGS
 * @example
 * ```
 * import { totalListings } from "thirdweb/extensions/IDirectListings";
 *
 * const result = await totalListings();
 *
 * ```
 */
export async function totalListings(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xc78b616c",
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
