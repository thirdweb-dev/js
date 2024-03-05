import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "airdropERC1155" function.
 */
export type AirdropERC1155Params = {
  tokenAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "tokenAddress";
  }>;
  tokenOwner: AbiParameterToPrimitiveType<{
    type: "address";
    name: "tokenOwner";
  }>;
  contents: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "contents";
    components: [
      { type: "address"; name: "recipient" },
      { type: "uint256"; name: "tokenId" },
      { type: "uint256"; name: "amount" },
    ];
  }>;
};

/**
 * Calls the "airdropERC1155" function on the contract.
 * @param options - The options for the "airdropERC1155" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { airdropERC1155 } from "thirdweb/extensions/erc1155";
 *
 * const transaction = airdropERC1155({
 *  tokenAddress: ...,
 *  tokenOwner: ...,
 *  contents: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function airdropERC1155(
  options: BaseTransactionOptions<AirdropERC1155Params>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x41444690",
      [
        {
          type: "address",
          name: "tokenAddress",
        },
        {
          type: "address",
          name: "tokenOwner",
        },
        {
          type: "tuple[]",
          name: "contents",
          components: [
            {
              type: "address",
              name: "recipient",
            },
            {
              type: "uint256",
              name: "tokenId",
            },
            {
              type: "uint256",
              name: "amount",
            },
          ],
        },
      ],
      [],
    ],
    params: [options.tokenAddress, options.tokenOwner, options.contents],
  });
}
