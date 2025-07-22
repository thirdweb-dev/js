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
 * Represents the parameters for the "enableAdapter" function.
 */
export type EnableAdapterParams = WithOverrides<{
  adapterType: AbiParameterToPrimitiveType<{
    type: "uint8";
    name: "adapterType";
  }>;
  config: AbiParameterToPrimitiveType<{ type: "bytes"; name: "config" }>;
}>;

export const FN_SELECTOR = "0xab348bdb" as const;
const FN_INPUTS = [
  {
    type: "uint8",
    name: "adapterType",
  },
  {
    type: "bytes",
    name: "config",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `enableAdapter` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `enableAdapter` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isEnableAdapterSupported } from "thirdweb/extensions/assets";
 *
 * const supported = isEnableAdapterSupported(["0x..."]);
 * ```
 */
export function isEnableAdapterSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "enableAdapter" function.
 * @param options - The options for the enableAdapter function.
 * @returns The encoded ABI parameters.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeEnableAdapterParams } from "thirdweb/extensions/assets";
 * const result = encodeEnableAdapterParams({
 *  adapterType: ...,
 *  config: ...,
 * });
 * ```
 */
export function encodeEnableAdapterParams(options: EnableAdapterParams) {
  return encodeAbiParameters(FN_INPUTS, [options.adapterType, options.config]);
}

/**
 * Encodes the "enableAdapter" function into a Hex string with its parameters.
 * @param options - The options for the enableAdapter function.
 * @returns The encoded hexadecimal string.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeEnableAdapter } from "thirdweb/extensions/assets";
 * const result = encodeEnableAdapter({
 *  adapterType: ...,
 *  config: ...,
 * });
 * ```
 */
export function encodeEnableAdapter(options: EnableAdapterParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeEnableAdapterParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "enableAdapter" function on the contract.
 * @param options - The options for the "enableAdapter" function.
 * @returns A prepared transaction object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { enableAdapter } from "thirdweb/extensions/assets";
 *
 * const transaction = enableAdapter({
 *  contract,
 *  adapterType: ...,
 *  config: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function enableAdapter(
  options: BaseTransactionOptions<
    | EnableAdapterParams
    | {
        asyncParams: () => Promise<EnableAdapterParams>;
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
      return [resolvedOptions.adapterType, resolvedOptions.config] as const;
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
