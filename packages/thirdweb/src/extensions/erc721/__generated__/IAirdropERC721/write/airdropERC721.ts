import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "airdropERC721" function.
 */

type AirdropERC721ParamsInternal = {
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

export type AirdropERC721Params = Prettify<
  | AirdropERC721ParamsInternal
  | {
      asyncParams: () => Promise<AirdropERC721ParamsInternal>;
    }
>;
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
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [
          resolvedParams.tokenAddress,
          resolvedParams.tokenOwner,
          resolvedParams.contents,
        ] as const;
      }

      return [
        options.tokenAddress,
        options.tokenOwner,
        options.contents,
      ] as const;
    },
  });
}
