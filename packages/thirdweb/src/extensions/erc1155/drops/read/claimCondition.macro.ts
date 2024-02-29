import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";

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
    method: $run$(() =>
      prepareMethod({
        name: "claimCondition",
        outputs: [
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
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      }),
    ),
    params: [options.tokenId],
  });
}
