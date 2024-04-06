import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "quoteExactInputSingle" function.
 */

export type QuoteExactInputSingleParams = {
  tokenIn: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenIn" }>;
  tokenOut: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenOut" }>;
  fee: AbiParameterToPrimitiveType<{ type: "uint24"; name: "fee" }>;
  amountIn: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amountIn" }>;
  sqrtPriceLimitX96: AbiParameterToPrimitiveType<{
    type: "uint160";
    name: "sqrtPriceLimitX96";
  }>;
};

export const FN_SELECTOR = "0xf7729d43" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "tokenIn",
  },
  {
    type: "address",
    name: "tokenOut",
  },
  {
    type: "uint24",
    name: "fee",
  },
  {
    type: "uint256",
    name: "amountIn",
  },
  {
    type: "uint160",
    name: "sqrtPriceLimitX96",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "amountOut",
  },
] as const;

/**
 * Encodes the parameters for the "quoteExactInputSingle" function.
 * @param options - The options for the quoteExactInputSingle function.
 * @returns The encoded ABI parameters.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeQuoteExactInputSingleParams } "thirdweb/extensions/uniswap";
 * const result = encodeQuoteExactInputSingleParams({
 *  tokenIn: ...,
 *  tokenOut: ...,
 *  fee: ...,
 *  amountIn: ...,
 *  sqrtPriceLimitX96: ...,
 * });
 * ```
 */
export function encodeQuoteExactInputSingleParams(
  options: QuoteExactInputSingleParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.tokenIn,
    options.tokenOut,
    options.fee,
    options.amountIn,
    options.sqrtPriceLimitX96,
  ]);
}

/**
 * Calls the "quoteExactInputSingle" function on the contract.
 * @param options - The options for the "quoteExactInputSingle" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { quoteExactInputSingle } from "thirdweb/extensions/uniswap";
 *
 * const transaction = quoteExactInputSingle({
 *  contract,
 *  tokenIn: ...,
 *  tokenOut: ...,
 *  fee: ...,
 *  amountIn: ...,
 *  sqrtPriceLimitX96: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function quoteExactInputSingle(
  options: BaseTransactionOptions<
    | QuoteExactInputSingleParams
    | {
        asyncParams: () => Promise<QuoteExactInputSingleParams>;
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
              resolvedParams.tokenIn,
              resolvedParams.tokenOut,
              resolvedParams.fee,
              resolvedParams.amountIn,
              resolvedParams.sqrtPriceLimitX96,
            ] as const;
          }
        : [
            options.tokenIn,
            options.tokenOut,
            options.fee,
            options.amountIn,
            options.sqrtPriceLimitX96,
          ],
  });
}
