import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

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

export const FN_SELECTOR = "0x7c2c059d" as const;
const FN_INPUTS = [
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
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "airdropERC721" function.
 * @param options - The options for the airdropERC721 function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeAirdropERC721Params } "thirdweb/extensions/erc721";
 * const result = encodeAirdropERC721Params({
 *  tokenAddress: ...,
 *  tokenOwner: ...,
 *  contents: ...,
 * });
 * ```
 */
export function encodeAirdropERC721Params(options: AirdropERC721Params) {
  return encodeAbiParameters(FN_INPUTS, [
    options.tokenAddress,
    options.tokenOwner,
    options.contents,
  ]);
}

/**
 * Calls the "airdropERC721" function on the contract.
 * @param options - The options for the "airdropERC721" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { airdropERC721 } from "thirdweb/extensions/erc721";
 *
 * const transaction = airdropERC721({
 *  contract,
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
  options: BaseTransactionOptions<
    | AirdropERC721Params
    | {
        asyncParams: () => Promise<AirdropERC721Params>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.tokenAddress,
              resolvedParams.tokenOwner,
              resolvedParams.contents,
            ] as const;
          }
        : [options.tokenAddress, options.tokenOwner, options.contents],
  });
}
