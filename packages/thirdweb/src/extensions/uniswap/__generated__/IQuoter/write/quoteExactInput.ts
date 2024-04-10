import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithValue,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "quoteExactInput" function.
 */
export type QuoteExactInputParams = WithValue<{
  path: AbiParameterToPrimitiveType<{ type: "bytes"; name: "path" }>;
  amountIn: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amountIn" }>;
}>;

export const FN_SELECTOR = "0xcdca1753" as const;
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
 * ```ts
 * import { encodeQuoteExactInputParams } "thirdweb/extensions/uniswap";
 * const result = encodeQuoteExactInputParams({
 *  path: ...,
 *  amountIn: ...,
 * });
 * ```
 */
export function encodeQuoteExactInputParams(options: QuoteExactInputParams) {
  return encodeAbiParameters(FN_INPUTS, [options.path, options.amountIn]);
}

/**
 * Calls the "quoteExactInput" function on the contract.
 * @param options - The options for the "quoteExactInput" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { quoteExactInput } from "thirdweb/extensions/uniswap";
 *
 * const transaction = quoteExactInput({
 *  contract,
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
  options: BaseTransactionOptions<
    | QuoteExactInputParams
    | {
        asyncParams: () => Promise<QuoteExactInputParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedParams = await asyncOptions();
      return [resolvedParams.path, resolvedParams.amountIn] as const;
    },
    value: async () => (await asyncOptions()).value,
  });
}
