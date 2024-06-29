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
 * Represents the parameters for the "uninstallExtension" function.
 */
export type UninstallExtensionParams = WithOverrides<{
  extension: AbiParameterToPrimitiveType<{
    name: "_extension";
    type: "address";
    internalType: "address";
  }>;
  data: AbiParameterToPrimitiveType<{
    name: "_data";
    type: "bytes";
    internalType: "bytes";
  }>;
}>;

export const FN_SELECTOR = "0x42b7d0c8" as const;
const FN_INPUTS = [
  {
    name: "_extension",
    type: "address",
    internalType: "address",
  },
  {
    name: "_data",
    type: "bytes",
    internalType: "bytes",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `uninstallExtension` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `uninstallExtension` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isUninstallExtensionSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isUninstallExtensionSupported(contract);
 * ```
 */
export async function isUninstallExtensionSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "uninstallExtension" function.
 * @param options - The options for the uninstallExtension function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeUninstallExtensionParams } "thirdweb/extensions/modular";
 * const result = encodeUninstallExtensionParams({
 *  extension: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeUninstallExtensionParams(
  options: UninstallExtensionParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.extension, options.data]);
}

/**
 * Encodes the "uninstallExtension" function into a Hex string with its parameters.
 * @param options - The options for the uninstallExtension function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeUninstallExtension } "thirdweb/extensions/modular";
 * const result = encodeUninstallExtension({
 *  extension: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeUninstallExtension(options: UninstallExtensionParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeUninstallExtensionParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "uninstallExtension" function on the contract.
 * @param options - The options for the "uninstallExtension" function.
 * @returns A prepared transaction object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { uninstallExtension } from "thirdweb/extensions/modular";
 *
 * const transaction = uninstallExtension({
 *  contract,
 *  extension: ...,
 *  data: ...,
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
export function uninstallExtension(
  options: BaseTransactionOptions<
    | UninstallExtensionParams
    | {
        asyncParams: () => Promise<UninstallExtensionParams>;
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
      return [resolvedOptions.extension, resolvedOptions.data] as const;
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
