import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "quoteExactOutputSingle" function.
 */

export type QuoteExactOutputSingleParams = {
  tokenIn: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenIn" }>;
  tokenOut: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenOut" }>;
  fee: AbiParameterToPrimitiveType<{ type: "uint24"; name: "fee" }>;
  amountOut: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "amountOut";
  }>;
  sqrtPriceLimitX96: AbiParameterToPrimitiveType<{
    type: "uint160";
    name: "sqrtPriceLimitX96";
  }>;
};

export const FN_SELECTOR = "0x30d07f21" as const;
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
    name: "amountOut",
  },
  {
    type: "uint160",
    name: "sqrtPriceLimitX96",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "amountIn",
  },
] as const;

/**
 * Encodes the parameters for the "quoteExactOutputSingle" function.
 * @param options - The options for the quoteExactOutputSingle function.
 * @returns The encoded ABI parameters.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeQuoteExactOutputSingleParams } "thirdweb/extensions/uniswap";
 * const result = encodeQuoteExactOutputSingleParams({
 *  tokenIn: ...,
 *  tokenOut: ...,
 *  fee: ...,
 *  amountOut: ...,
 *  sqrtPriceLimitX96: ...,
 * });
 * ```
 */
export function encodeQuoteExactOutputSingleParams(
  options: QuoteExactOutputSingleParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.tokenIn,
    options.tokenOut,
    options.fee,
    options.amountOut,
    options.sqrtPriceLimitX96,
  ]);
}

/**
 * Calls the "quoteExactOutputSingle" function on the contract.
 * @param options - The options for the "quoteExactOutputSingle" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { quoteExactOutputSingle } from "thirdweb/extensions/uniswap";
 *
 * const transaction = quoteExactOutputSingle({
 *  contract,
 *  tokenIn: ...,
 *  tokenOut: ...,
 *  fee: ...,
 *  amountOut: ...,
 *  sqrtPriceLimitX96: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function quoteExactOutputSingle(
  options: BaseTransactionOptions<
    | QuoteExactOutputSingleParams
    | {
        asyncParams: () => Promise<QuoteExactOutputSingleParams>;
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
              resolvedParams.amountOut,
              resolvedParams.sqrtPriceLimitX96,
            ] as const;
          }
        : [
            options.tokenIn,
            options.tokenOut,
            options.fee,
            options.amountOut,
            options.sqrtPriceLimitX96,
          ],
  });
}
