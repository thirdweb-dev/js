import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "airdropERC1155" function.
 */

type AirdropERC1155ParamsInternal = {
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

export type AirdropERC1155Params = Prettify<
  | AirdropERC1155ParamsInternal
  | {
      asyncParams: () => Promise<AirdropERC1155ParamsInternal>;
    }
>;
const FN_SELECTOR = "0x41444690" as const;
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
      {
        type: "uint256",
        name: "amount",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "airdropERC1155" function.
 * @param options - The options for the airdropERC1155 function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```
 * import { encodeAirdropERC1155Params } "thirdweb/extensions/erc1155";
 * const result = encodeAirdropERC1155Params({
 *  tokenAddress: ...,
 *  tokenOwner: ...,
 *  contents: ...,
 * });
 * ```
 */
export function encodeAirdropERC1155Params(
  options: AirdropERC1155ParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.tokenAddress,
    options.tokenOwner,
    options.contents,
  ]);
}

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
