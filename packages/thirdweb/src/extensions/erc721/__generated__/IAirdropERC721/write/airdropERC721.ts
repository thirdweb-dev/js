import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "airdropERC721" function.
 */
export type AirdropERC721Params = {
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
    ];
  }>;
};

/**
 * Calls the "airdropERC721" function on the contract.
 * @param options - The options for the "airdropERC721" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { airdropERC721 } from "thirdweb/extensions/erc721";
 *
 * const transaction = airdropERC721({
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
export function airdropERC721(
  options: BaseTransactionOptions<AirdropERC721Params>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x7c2c059d",
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
          ],
        },
      ],
      [],
    ],
    params: [options.tokenAddress, options.tokenOwner, options.contents],
  });
}
