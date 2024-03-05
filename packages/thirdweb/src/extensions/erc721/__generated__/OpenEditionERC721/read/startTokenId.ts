import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "startTokenId" function on the contract.
 * @param options - The options for the startTokenId function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { startTokenId } from "thirdweb/extensions/erc721";
 *
 * const result = await startTokenId();
 *
 * ```
 */
export async function startTokenId(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xe6798baa",
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
