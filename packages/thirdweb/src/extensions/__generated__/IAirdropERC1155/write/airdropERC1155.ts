import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "airdropERC1155" function.
 */
export type AirdropERC1155Params = {
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
      { internalType: "uint256"; name: "amount"; type: "uint256" },
    ];
    internalType: "struct IAirdropERC1155.AirdropContent[]";
    name: "contents";
    type: "tuple[]";
  }>;
};

/**
 * Calls the airdropERC1155 function on the contract.
 * @param options - The options for the airdropERC1155 function.
 * @returns A prepared transaction object.
 * @extension IAIRDROPERC1155
 * @example
 * ```
 * import { airdropERC1155 } from "thirdweb/extensions/IAirdropERC1155";
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
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          internalType: "struct IAirdropERC1155.AirdropContent[]",
          name: "contents",
          type: "tuple[]",
        },
      ],
      [],
    ],
    params: [options.tokenAddress, options.tokenOwner, options.contents],
  });
}
