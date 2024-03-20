import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "quoteExactOutput" function.
 */

type QuoteExactOutputParamsInternal = {
  path: AbiParameterToPrimitiveType<{ type: "bytes"; name: "path" }>;
  amountOut: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "amountOut";
  }>;
};

export type QuoteExactOutputParams = Prettify<
  | QuoteExactOutputParamsInternal
  | {
      asyncParams: () => Promise<QuoteExactOutputParamsInternal>;
    }
>;
const METHOD = [
  "0x2f80bb1d",
  [
    {
      type: "bytes",
      name: "path",
    },
    {
      type: "uint256",
      name: "amountOut",
    },
  ],
  [
    {
      type: "uint256",
      name: "amountIn",
    },
  ],
] as const;

/**
 * Calls the "quoteExactOutput" function on the contract.
 * @param options - The options for the "quoteExactOutput" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```
 * import { quoteExactOutput } from "thirdweb/extensions/uniswap";
 *
 * const transaction = quoteExactOutput({
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
  options: BaseTransactionOptions<QuoteExactOutputParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.path, resolvedParams.amountOut] as const;
          }
        : [options.path, options.amountOut],
  });
}
