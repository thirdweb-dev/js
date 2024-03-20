import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "quoteExactInputSingle" function.
 */

type QuoteExactInputSingleParamsInternal = {
  tokenIn: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenIn" }>;
  tokenOut: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenOut" }>;
  fee: AbiParameterToPrimitiveType<{ type: "uint24"; name: "fee" }>;
  amountIn: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amountIn" }>;
  sqrtPriceLimitX96: AbiParameterToPrimitiveType<{
    type: "uint160";
    name: "sqrtPriceLimitX96";
  }>;
};

export type QuoteExactInputSingleParams = Prettify<
  | QuoteExactInputSingleParamsInternal
  | {
      asyncParams: () => Promise<QuoteExactInputSingleParamsInternal>;
    }
>;
const METHOD = [
  "0xf7729d43",
  [
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
  ],
  [
    {
      type: "uint256",
      name: "amountOut",
    },
  ],
] as const;

/**
 * Calls the "quoteExactInputSingle" function on the contract.
 * @param options - The options for the "quoteExactInputSingle" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```
 * import { quoteExactInputSingle } from "thirdweb/extensions/uniswap";
 *
 * const transaction = quoteExactInputSingle({
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
  options: BaseTransactionOptions<QuoteExactInputSingleParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
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
