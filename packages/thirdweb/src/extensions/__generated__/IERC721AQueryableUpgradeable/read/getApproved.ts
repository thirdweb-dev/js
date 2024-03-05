import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getApproved" function.
 */
export type GetApprovedParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
};

/**
 * Calls the getApproved function on the contract.
 * @param options - The options for the getApproved function.
 * @returns The parsed result of the function call.
 * @extension IERC721AQUERYABLEUPGRADEABLE
 * @example
 * ```
 * import { getApproved } from "thirdweb/extensions/IERC721AQueryableUpgradeable";
 *
 * const result = await getApproved({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getApproved(
  options: BaseTransactionOptions<GetApprovedParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x081812fc",
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
    ],
    params: [options.tokenId],
  });
}
