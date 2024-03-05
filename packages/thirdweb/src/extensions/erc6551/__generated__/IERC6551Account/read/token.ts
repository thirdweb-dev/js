import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "token" function on the contract.
 * @param options - The options for the token function.
 * @returns The parsed result of the function call.
 * @extension ERC6551
 * @example
 * ```
 * import { token } from "thirdweb/extensions/erc6551";
 *
 * const result = await token();
 *
 * ```
 */
export async function token(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xfc0c546a",
      [],
      [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "tokenContract",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
    ],
    params: [],
  });
}
