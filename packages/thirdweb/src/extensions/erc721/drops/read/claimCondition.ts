import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
/**
 * Claims the condition for a transaction.
 * @param options The transaction options.
 * @returns A promise that resolves with the result of the read contract.
 * @extension
 * @example
 * ```ts
 * import { claimCondition } from "thirdweb/extensions/erc721";
 * const claimCondition = await claimCondition({ contract });
 * ```
 */
export async function claimCondition(options: BaseTransactionOptions) {
  return readContract({
    ...options,
    method: [
  "0xd637ed59",
  [],
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
  });
}
