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
 * Represents the parameters for the "multicall" function.
 */
export type MulticallParams = WithOverrides<{
  data: AbiParameterToPrimitiveType<{ type: "bytes[]"; name: "data" }>;
}>;

export const FN_SELECTOR = "0xac9650d8" as const;
const FN_INPUTS = [
  {
    name: "data",
    type: "bytes[]",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "results",
    type: "bytes[]",
  },
] as const;

/**
 * Checks if the `multicall` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `multicall` method is supported.
 * @extension COMMON
 * @example
 * ```ts
 * import { isMulticallSupported } from "thirdweb/extensions/common";
 *
 * const supported = isMulticallSupported(["0x..."]);
 * ```
 */
export function isMulticallSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "multicall" function.
 * @param options - The options for the multicall function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeMulticallParams } from "thirdweb/extensions/common";
 * const result = encodeMulticallParams({
 *  data: ...,
 * });
 * ```
 */
export function encodeMulticallParams(options: MulticallParams) {
  return encodeAbiParameters(FN_INPUTS, [options.data]);
}

/**
 * Encodes the "multicall" function into a Hex string with its parameters.
 * @param options - The options for the multicall function.
 * @returns The encoded hexadecimal string.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeMulticall } from "thirdweb/extensions/common";
 * const result = encodeMulticall({
 *  data: ...,
 * });
 * ```
 */
export function encodeMulticall(options: MulticallParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeMulticallParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "multicall" function on the contract.
 * @param options - The options for the "multicall" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { multicall } from "thirdweb/extensions/common";
 *
 * const transaction = multicall({
 *  contract,
 *  data: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function multicall(
  options: BaseTransactionOptions<
    | MulticallParams
    | {
        asyncParams: () => Promise<MulticallParams>;
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
      return [resolvedOptions.data] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
