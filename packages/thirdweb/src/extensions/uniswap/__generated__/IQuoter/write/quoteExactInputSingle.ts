import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "quoteExactInputSingle" function.
 */
export type QuoteExactInputSingleParams = WithOverrides<{
  tokenIn: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenIn" }>;
  tokenOut: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenOut" }>;
  fee: AbiParameterToPrimitiveType<{ type: "uint24"; name: "fee" }>;
  amountIn: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amountIn" }>;
  sqrtPriceLimitX96: AbiParameterToPrimitiveType<{
    type: "uint160";
    name: "sqrtPriceLimitX96";
  }>;
}>;

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
 * Checks if the `quoteExactInputSingle` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `quoteExactInputSingle` method is supported.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { isQuoteExactInputSingleSupported } from "thirdweb/extensions/uniswap";
 *
 * const supported = await isQuoteExactInputSingleSupported(contract);
 * ```
 */
export async function isQuoteExactInputSingleSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

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
 * Encodes the "quoteExactInputSingle" function into a Hex string with its parameters.
 * @param options - The options for the quoteExactInputSingle function.
 * @returns The encoded hexadecimal string.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeQuoteExactInputSingle } "thirdweb/extensions/uniswap";
 * const result = encodeQuoteExactInputSingle({
 *  tokenIn: ...,
 *  tokenOut: ...,
 *  fee: ...,
 *  amountIn: ...,
 *  sqrtPriceLimitX96: ...,
 * });
 * ```
 */
export function encodeQuoteExactInputSingle(
  options: QuoteExactInputSingleParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeQuoteExactInputSingleParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "quoteExactInputSingle" function on the contract.
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
 *  overrides: {
 *    ...
 *  }
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
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [
        resolvedOptions.tokenIn,
        resolvedOptions.tokenOut,
        resolvedOptions.fee,
        resolvedOptions.amountIn,
        resolvedOptions.sqrtPriceLimitX96,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
  });
}
