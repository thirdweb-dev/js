import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "quoteExactOutput" function.
 */
export type QuoteExactOutputParams = WithOverrides<{
  path: AbiParameterToPrimitiveType<{ type: "bytes"; name: "path" }>;
  amountOut: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "amountOut";
  }>;
}>;

export const FN_SELECTOR = "0x2f80bb1d" as const;
const FN_INPUTS = [
  {
    name: "path",
    type: "bytes",
  },
  {
    name: "amountOut",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "amountIn",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `quoteExactOutput` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `quoteExactOutput` method is supported.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { isQuoteExactOutputSupported } from "thirdweb/extensions/uniswap";
 *
 * const supported = isQuoteExactOutputSupported(["0x..."]);
 * ```
 */
export function isQuoteExactOutputSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "quoteExactOutput" function.
 * @param options - The options for the quoteExactOutput function.
 * @returns The encoded ABI parameters.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeQuoteExactOutputParams } from "thirdweb/extensions/uniswap";
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
 * Encodes the "quoteExactOutput" function into a Hex string with its parameters.
 * @param options - The options for the quoteExactOutput function.
 * @returns The encoded hexadecimal string.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeQuoteExactOutput } from "thirdweb/extensions/uniswap";
 * const result = encodeQuoteExactOutput({
 *  path: ...,
 *  amountOut: ...,
 * });
 * ```
 */
export function encodeQuoteExactOutput(options: QuoteExactOutputParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeQuoteExactOutputParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "quoteExactOutput" function on the contract.
 * @param options - The options for the "quoteExactOutput" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { quoteExactOutput } from "thirdweb/extensions/uniswap";
 *
 * const transaction = quoteExactOutput({
 *  contract,
 *  path: ...,
 *  amountOut: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
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
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
    contract: options.contract,
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.path, resolvedOptions.amountOut] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
