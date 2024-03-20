import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

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
const METHOD = [
  "0xcdca1753",
  [
    {
      type: "bytes",
      name: "path",
    },
    {
      type: "uint256",
      name: "amountIn",
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
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.path, resolvedParams.amountIn] as const;
          }
        : [options.path, options.amountIn],
  });
}
