import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "uri" function.
 */
export type UriParams = {
  id: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_id";
    type: "uint256";
  }>;
};

/**
 * Calls the uri function on the contract.
 * @param options - The options for the uri function.
 * @returns The parsed result of the function call.
 * @extension IERC1155METADATA
 * @example
 * ```
 * import { uri } from "thirdweb/extensions/IERC1155Metadata";
 *
 * const result = await uri({
 *  id: ...,
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
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
    ],
    params: [options.id],
  });
}
