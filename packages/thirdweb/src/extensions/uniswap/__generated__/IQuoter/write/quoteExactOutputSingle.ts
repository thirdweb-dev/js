import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "quoteExactOutputSingle" function.
 */

type QuoteExactOutputSingleParamsInternal = {
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

export type QuoteExactOutputSingleParams = Prettify<
  | QuoteExactOutputSingleParamsInternal
  | {
      asyncParams: () => Promise<QuoteExactOutputSingleParamsInternal>;
    }
>;
/**
 * Calls the "quoteExactOutputSingle" function on the contract.
 * @param options - The options for the "quoteExactOutputSingle" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```
 * import { quoteExactOutputSingle } from "thirdweb/extensions/uniswap";
 *
 * const transaction = quoteExactOutputSingle({
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
  options: BaseTransactionOptions<QuoteExactOutputSingleParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x30d07f21",
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
          name: "amountOut",
        },
        {
          type: "uint160",
          name: "sqrtPriceLimitX96",
        },
      ],
      [
        {
          type: "uint256",
          name: "amountIn",
        },
      ],
    ],
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
