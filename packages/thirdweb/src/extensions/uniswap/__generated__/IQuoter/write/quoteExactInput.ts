import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "quoteExactInput" function.
 */
export type QuoteExactInputParams = {
  path: AbiParameterToPrimitiveType<{ type: "bytes"; name: "path" }>;
  amountIn: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amountIn" }>;
};

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
    method: [
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
    ],
    params: [options.path, options.amountIn],
  });
}
