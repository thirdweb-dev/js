import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getMetadataUri" function.
 */
export type GetMetadataUriParams = {
  chainId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_chainId";
    type: "uint256";
  }>;
  deployment: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_deployment";
    type: "address";
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
          internalType: "uint256",
          name: "_chainId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_deployment",
          type: "address",
        },
      ],
      [
        {
          internalType: "string",
          name: "metadataUri",
          type: "string",
        },
      ],
    ],
    params: [options.chainId, options.deployment],
  });
}
