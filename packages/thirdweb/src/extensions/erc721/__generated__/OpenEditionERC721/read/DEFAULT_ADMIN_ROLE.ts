import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "DEFAULT_ADMIN_ROLE" function on the contract.
 * @param options - The options for the DEFAULT_ADMIN_ROLE function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { DEFAULT_ADMIN_ROLE } from "thirdweb/extensions/erc721";
 *
 * const result = await DEFAULT_ADMIN_ROLE();
 *
 * ```
 */
export async function DEFAULT_ADMIN_ROLE(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xa217fddf",
      [],
      [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
    ],
    params: [],
  });
}
