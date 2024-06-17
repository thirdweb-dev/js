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
 * Represents the parameters for the "installExtension" function.
 */
export type InstallExtensionParams = WithOverrides<{
  extensionContract: AbiParameterToPrimitiveType<{
    name: "extensionContract";
    type: "address";
    internalType: "address";
  }>;
  data: AbiParameterToPrimitiveType<{
    name: "data";
    type: "bytes";
    internalType: "bytes";
  }>;
}>;

export const FN_SELECTOR = "0xaca696f5" as const;
const FN_INPUTS = [
  {
    name: "extensionContract",
    type: "address",
    internalType: "address",
  },
  {
    name: "data",
    type: "bytes",
    internalType: "bytes",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `installExtension` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `installExtension` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isInstallExtensionSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isInstallExtensionSupported(contract);
 * ```
 */
export async function isInstallExtensionSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "installExtension" function.
 * @param options - The options for the installExtension function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeInstallExtensionParams } "thirdweb/extensions/modular";
 * const result = encodeInstallExtensionParams({
 *  extensionContract: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeInstallExtensionParams(options: InstallExtensionParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.extensionContract,
    options.data,
  ]);
}

/**
 * Encodes the "installExtension" function into a Hex string with its parameters.
 * @param options - The options for the installExtension function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeInstallExtension } "thirdweb/extensions/modular";
 * const result = encodeInstallExtension({
 *  extensionContract: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeInstallExtension(options: InstallExtensionParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeInstallExtensionParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "installExtension" function on the contract.
 * @param options - The options for the "installExtension" function.
 * @returns A prepared transaction object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { installExtension } from "thirdweb/extensions/modular";
 *
 * const transaction = installExtension({
 *  contract,
 *  extensionContract: ...,
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
export function installExtension(
  options: BaseTransactionOptions<
    | InstallExtensionParams
    | {
        asyncParams: () => Promise<InstallExtensionParams>;
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
      return [resolvedOptions.extensionContract, resolvedOptions.data] as const;
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
