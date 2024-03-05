import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getClaimConditionById" function.
 */
export type GetClaimConditionByIdParams = {
  conditionId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_conditionId";
    type: "uint256";
  }>;
};

/**
 * Calls the "getClaimConditionById" function on the contract.
 * @param options - The options for the getClaimConditionById function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { getClaimConditionById } from "thirdweb/extensions/erc721";
 *
 * const result = await getClaimConditionById({
 *  conditionId: ...,
 * });
 *
 * ```
 */
export async function getClaimConditionById(
  options: BaseTransactionOptions<GetClaimConditionByIdParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x6f8934f4",
      [
        {
          internalType: "uint256",
          name: "_conditionId",
          type: "uint256",
        },
      ],
      [
        {
          components: [
            {
              internalType: "uint256",
              name: "startTimestamp",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "maxClaimableSupply",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "supplyClaimed",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "quantityLimitPerWallet",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "merkleRoot",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "pricePerToken",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "currency",
              type: "address",
            },
            {
              internalType: "string",
              name: "metadata",
              type: "string",
            },
          ],
          internalType: "struct IClaimCondition.ClaimCondition",
          name: "condition",
          type: "tuple",
        },
      ],
    ],
    params: [options.conditionId],
  });
}
