import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "airdropERC721" function.
 */
export type AirdropERC721Params = {
  tokenAddress: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "tokenAddress";
    type: "address";
  }>;
  tokenOwner: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "tokenOwner";
    type: "address";
  }>;
  contents: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "address"; name: "recipient"; type: "address" },
      { internalType: "uint256"; name: "tokenId"; type: "uint256" },
    ];
    internalType: "struct IAirdropERC721.AirdropContent[]";
    name: "contents";
    type: "tuple[]";
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
          internalType: "address",
          name: "tokenAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "tokenOwner",
          type: "address",
        },
        {
          components: [
            {
              internalType: "address",
              name: "recipient",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          internalType: "struct IAirdropERC721.AirdropContent[]",
          name: "contents",
          type: "tuple[]",
        },
      ],
      [],
    ],
    params: [options.tokenAddress, options.tokenOwner, options.contents],
  });
}
