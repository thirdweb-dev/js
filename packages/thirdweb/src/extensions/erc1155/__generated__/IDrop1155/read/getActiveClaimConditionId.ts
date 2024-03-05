import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getActiveClaimConditionId" function.
 */
export type GetActiveClaimConditionIdParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_tokenId";
    type: "uint256";
  }>;
};

/**
 * Calls the "getActiveClaimConditionId" function on the contract.
 * @param options - The options for the getActiveClaimConditionId function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```
 * import { getActiveClaimConditionId } from "thirdweb/extensions/erc1155";
 *
 * const result = await getActiveClaimConditionId({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getActiveClaimConditionId(
  options: BaseTransactionOptions<GetActiveClaimConditionIdParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x5ab063e8",
      [
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
    ],
    params: [options.tokenId],
  });
}
