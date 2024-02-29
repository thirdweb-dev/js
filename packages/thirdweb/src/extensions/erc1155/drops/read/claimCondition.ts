import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
/**
 * Represents the parameters required for a claim condition.
 */
export type ClaimConditionParams = { tokenId: bigint };

/**
 * Claims the condition for a transaction.
 * @param options The transaction options.
 * @returns A promise that resolves with the result of the read contract.
 * @extension
 * @example
 * ```ts
 * import { claimCondition } from "thirdweb/extensions/erc1155";
 * const claimCondition = await claimCondition({ contract, tokenId });
 * ```
 */
export async function claimCondition(
  options: BaseTransactionOptions<ClaimConditionParams>,
) {
  return readContract({
    ...options,
    method: [
  "0xe9703d25",
  [
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  [
    {
      "components": [
        {
          "internalType": "uint256",
          "name": "startTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "maxClaimableSupply",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "supplyClaimed",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "quantityLimitPerWallet",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "merkleRoot",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "pricePerToken",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "currency",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "metadata",
          "type": "string"
        }
      ],
      "internalType": "struct IClaimCondition.ClaimCondition",
      "name": "condition",
      "type": "tuple"
    }
  ]
],
    params: [options.tokenId],
  });
}
