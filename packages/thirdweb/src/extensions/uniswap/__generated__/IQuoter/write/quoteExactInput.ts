import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "quoteExactInput" function.
 */

type QuoteExactInputParamsInternal = {
  path: AbiParameterToPrimitiveType<{ type: "bytes"; name: "path" }>;
  amountIn: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amountIn" }>;
};

export type QuoteExactInputParams = Prettify<
  | QuoteExactInputParamsInternal
  | {
      asyncParams: () => Promise<QuoteExactInputParamsInternal>;
    }
>;
const FN_SELECTOR = "0xcdca1753" as const;
const FN_INPUTS = [
  {
    type: "bytes",
    name: "path",
  },
  {
    type: "uint256",
    name: "amountIn",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "amountOut",
  },
] as const;

/**
 * Encodes the parameters for the "quoteExactInput" function.
 * @param options - The options for the quoteExactInput function.
 * @returns The encoded ABI parameters.
 * @extension UNISWAP
 * @example
 * ```
 * import { encodeQuoteExactInputParams } "thirdweb/extensions/uniswap";
 * const result = encodeQuoteExactInputParams({
 *  path: ...,
 *  amountIn: ...,
 * });
 * ```
 */
export function encodeQuoteExactInputParams(
  options: QuoteExactInputParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [options.path, options.amountIn]);
}

/**
 * Calls the "quoteExactInput" function on the contract.
 * @param options - The options for the "quoteExactInput" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```
 * import { quoteExactInput } from "thirdweb/extensions/uniswap";
 *
 * const transaction = quoteExactInput({
 *  path: ...,
 *  amountIn: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function quoteExactInput(
  options: BaseTransactionOptions<QuoteExactInputParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.path, resolvedParams.amountIn] as const;
          }
        : [options.path, options.amountIn],
  });
}
