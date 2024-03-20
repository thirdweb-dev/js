import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";

const METHOD = [
  "0x372500ab",
  [],
  [
    {
      type: "tuple[]",
      name: "rewardUnits",
      components: [
        {
          type: "address",
          name: "assetContract",
        },
        {
          type: "uint8",
          name: "tokenType",
        },
        {
          type: "uint256",
          name: "tokenId",
        },
        {
          type: "uint256",
          name: "totalAmount",
        },
      ],
    },
  ],
] as const;

/**
 * Calls the "claimRewards" function on the contract.
 * @param options - The options for the "claimRewards" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { claimRewards } from "thirdweb/extensions/erc1155";
 *
 * const transaction = claimRewards();
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function claimRewards(options: BaseTransactionOptions) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
  });
}
