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
 * Represents the parameters for the "exactOutputSingle" function.
 */
export type ExactOutputSingleParams = WithOverrides<{
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "params";
    components: [
      { type: "address"; name: "tokenIn" },
      { type: "address"; name: "tokenOut" },
      { type: "uint24"; name: "fee" },
      { type: "address"; name: "recipient" },
      { type: "uint256"; name: "deadline" },
      { type: "uint256"; name: "amountOut" },
      { type: "uint256"; name: "amountInMaximum" },
      { type: "uint160"; name: "sqrtPriceLimitX96" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0xdb3e2198" as const;
const FN_INPUTS = [
  {
    components: [
      {
        name: "tokenIn",
        type: "address",
      },
      {
        name: "tokenOut",
        type: "address",
      },
      {
        name: "fee",
        type: "uint24",
      },
      {
        name: "recipient",
        type: "address",
      },
      {
        name: "deadline",
        type: "uint256",
      },
      {
        name: "amountOut",
        type: "uint256",
      },
      {
        name: "amountInMaximum",
        type: "uint256",
      },
      {
        name: "sqrtPriceLimitX96",
        type: "uint160",
      },
    ],
    name: "params",
    type: "tuple",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "amountIn",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `exactOutputSingle` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `exactOutputSingle` method is supported.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { isExactOutputSingleSupported } from "thirdweb/extensions/uniswap";
 *
 * const supported = isExactOutputSingleSupported(["0x..."]);
 * ```
 */
export function isExactOutputSingleSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "exactOutputSingle" function.
 * @param options - The options for the exactOutputSingle function.
 * @returns The encoded ABI parameters.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeExactOutputSingleParams } from "thirdweb/extensions/uniswap";
 * const result = encodeExactOutputSingleParams({
 *  params: ...,
 * });
 * ```
 */
export function encodeExactOutputSingleParams(
  options: ExactOutputSingleParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}

/**
 * Encodes the "exactOutputSingle" function into a Hex string with its parameters.
 * @param options - The options for the exactOutputSingle function.
 * @returns The encoded hexadecimal string.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeExactOutputSingle } from "thirdweb/extensions/uniswap";
 * const result = encodeExactOutputSingle({
 *  params: ...,
 * });
 * ```
 */
export function encodeExactOutputSingle(options: ExactOutputSingleParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeExactOutputSingleParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "exactOutputSingle" function on the contract.
 * @param options - The options for the "exactOutputSingle" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { exactOutputSingle } from "thirdweb/extensions/uniswap";
 *
 * const transaction = exactOutputSingle({
 *  contract,
 *  params: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function exactOutputSingle(
  options: BaseTransactionOptions<
    | ExactOutputSingleParams
    | {
        asyncParams: () => Promise<ExactOutputSingleParams>;
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
      return [resolvedOptions.params] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
