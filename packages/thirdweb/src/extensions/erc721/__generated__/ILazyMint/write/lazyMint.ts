import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "lazyMint" function.
 */

export type LazyMintParams = {
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amount" }>;
  baseURIForTokens: AbiParameterToPrimitiveType<{
    type: "string";
    name: "baseURIForTokens";
  }>;
  extraData: AbiParameterToPrimitiveType<{ type: "bytes"; name: "extraData" }>;
};

export const FN_SELECTOR = "0xd37c353b" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "amount",
  },
  {
    type: "string",
    name: "baseURIForTokens",
  },
  {
    type: "bytes",
    name: "extraData",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "batchId",
  },
] as const;

/**
 * Encodes the parameters for the "lazyMint" function.
 * @param options - The options for the lazyMint function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeLazyMintParams } "thirdweb/extensions/erc721";
 * const result = encodeLazyMintParams({
 *  amount: ...,
 *  baseURIForTokens: ...,
 *  extraData: ...,
 * });
 * ```
 */
export function encodeLazyMintParams(options: LazyMintParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.amount,
    options.baseURIForTokens,
    options.extraData,
  ]);
}

/**
 * Calls the "lazyMint" function on the contract.
 * @param options - The options for the "lazyMint" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { lazyMint } from "thirdweb/extensions/erc721";
 *
 * const transaction = lazyMint({
 *  contract,
 *  amount: ...,
 *  baseURIForTokens: ...,
 *  extraData: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function lazyMint(
  options: BaseTransactionOptions<
    | LazyMintParams
    | {
        asyncParams: () => Promise<LazyMintParams>;
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
              resolvedParams.amount,
              resolvedParams.baseURIForTokens,
              resolvedParams.extraData,
            ] as const;
          }
        : [options.amount, options.baseURIForTokens, options.extraData],
  });
}
