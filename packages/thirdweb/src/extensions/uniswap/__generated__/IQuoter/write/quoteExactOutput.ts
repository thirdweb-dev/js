import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "quoteExactOutput" function.
 */

export type QuoteExactOutputParams = {
  path: AbiParameterToPrimitiveType<{ type: "bytes"; name: "path" }>;
  amountOut: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "amountOut";
  }>;
};

export const FN_SELECTOR = "0x2f80bb1d" as const;
const FN_INPUTS = [
  {
    type: "bytes",
    name: "path",
  },
  {
    type: "uint256",
    name: "amountOut",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "amountIn",
  },
] as const;

/**
 * Encodes the parameters for the "quoteExactOutput" function.
 * @param options - The options for the quoteExactOutput function.
 * @returns The encoded ABI parameters.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeQuoteExactOutputParams } "thirdweb/extensions/uniswap";
 * const result = encodeQuoteExactOutputParams({
 *  path: ...,
 *  amountOut: ...,
 * });
 * ```
 */
export function encodeQuoteExactOutputParams(options: QuoteExactOutputParams) {
  return encodeAbiParameters(FN_INPUTS, [options.path, options.amountOut]);
}

/**
 * Calls the "quoteExactOutput" function on the contract.
 * @param options - The options for the "quoteExactOutput" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { quoteExactOutput } from "thirdweb/extensions/uniswap";
 *
 * const transaction = quoteExactOutput({
 *  contract,
 *  path: ...,
 *  amountOut: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function quoteExactOutput(
  options: BaseTransactionOptions<
    | QuoteExactOutputParams
    | {
        asyncParams: () => Promise<QuoteExactOutputParams>;
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
            return [resolvedParams.path, resolvedParams.amountOut] as const;
          }
        : [options.path, options.amountOut],
  });
}
