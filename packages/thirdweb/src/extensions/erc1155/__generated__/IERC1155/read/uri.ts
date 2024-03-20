import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "uri" function.
 */
export type UriParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

/**
 * Calls the "uri" function on the contract.
 * @param options - The options for the uri function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```
 * import { uri } from "thirdweb/extensions/erc1155";
 *
 * const result = await uri({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function uri(options: BaseTransactionOptions<UriParams>) {
  return readContract({
    contract: options.contract,
    method: [
      "0x0e89341c",
      [
        {
          type: "uint256",
          name: "tokenId",
        },
      ],
      [
        {
          type: "string",
        },
      ],
    ],
    params: [options.tokenId],
  });
}
