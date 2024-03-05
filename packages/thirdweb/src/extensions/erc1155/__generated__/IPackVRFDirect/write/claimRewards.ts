import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";

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
    method: [
      "0x372500ab",
      [],
      [
        {
          components: [
            {
              internalType: "address",
              name: "assetContract",
              type: "address",
            },
            {
              internalType: "enum ITokenBundle.TokenType",
              name: "tokenType",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "totalAmount",
              type: "uint256",
            },
          ],
          internalType: "struct ITokenBundle.Token[]",
          name: "rewardUnits",
          type: "tuple[]",
        },
      ],
    ],
    params: [],
  });
}
