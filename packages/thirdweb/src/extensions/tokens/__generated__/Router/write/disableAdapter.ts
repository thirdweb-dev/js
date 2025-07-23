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
 * Represents the parameters for the "disableAdapter" function.
 */
export type DisableAdapterParams = WithOverrides<{
  adapterType: AbiParameterToPrimitiveType<{
    type: "uint8";
    name: "adapterType";
  }>;
}>;

export const FN_SELECTOR = "0xa3f3a7bd" as const;
const FN_INPUTS = [
  {
    type: "uint8",
    name: "adapterType",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `disableAdapter` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `disableAdapter` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isDisableAdapterSupported } from "thirdweb/extensions/tokens";
 *
 * const supported = isDisableAdapterSupported(["0x..."]);
 * ```
 */
export function isDisableAdapterSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "disableAdapter" function.
 * @param options - The options for the disableAdapter function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeDisableAdapterParams } from "thirdweb/extensions/tokens";
 * const result = encodeDisableAdapterParams({
 *  adapterType: ...,
 * });
 * ```
 */
export function encodeDisableAdapterParams(options: DisableAdapterParams) {
  return encodeAbiParameters(FN_INPUTS, [options.adapterType]);
}

/**
 * Encodes the "disableAdapter" function into a Hex string with its parameters.
 * @param options - The options for the disableAdapter function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeDisableAdapter } from "thirdweb/extensions/tokens";
 * const result = encodeDisableAdapter({
 *  adapterType: ...,
 * });
 * ```
 */
export function encodeDisableAdapter(options: DisableAdapterParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeDisableAdapterParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "disableAdapter" function on the contract.
 * @param options - The options for the "disableAdapter" function.
 * @returns A prepared transaction object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { disableAdapter } from "thirdweb/extensions/tokens";
 *
 * const transaction = disableAdapter({
 *  contract,
 *  adapterType: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function disableAdapter(
  options: BaseTransactionOptions<
    | DisableAdapterParams
    | {
        asyncParams: () => Promise<DisableAdapterParams>;
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
      return [resolvedOptions.adapterType] as const;
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
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
  });
}
