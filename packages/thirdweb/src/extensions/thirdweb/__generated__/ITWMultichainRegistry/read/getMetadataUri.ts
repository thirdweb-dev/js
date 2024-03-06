import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getMetadataUri" function.
 */
export type GetMetadataUriParams = {
  chainId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_chainId" }>;
  deployment: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_deployment";
  }>;
};

/**
 * Calls the "getMetadataUri" function on the contract.
 * @param options - The options for the getMetadataUri function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```
 * import { getMetadataUri } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getMetadataUri({
 *  chainId: ...,
 *  deployment: ...,
 * });
 *
 * ```
 */
export async function getMetadataUri(
  options: BaseTransactionOptions<GetMetadataUriParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xf4c2012d",
      [
        {
          type: "uint256",
          name: "_chainId",
        },
        {
          type: "address",
          name: "_deployment",
        },
      ],
      [
        {
          type: "string",
          name: "metadataUri",
        },
      ],
    ],
    params: [options.chainId, options.deployment],
  });
}
