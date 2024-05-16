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
 * Represents the parameters for the "updateExtension" function.
 */
export type UpdateExtensionParams = WithOverrides<{
  currentExtensionImplementation: AbiParameterToPrimitiveType<{
    name: "_currentExtensionImplementation";
    type: "address";
    internalType: "address";
  }>;
  newExtensionImplementation: AbiParameterToPrimitiveType<{
    name: "_newExtensionImplementation";
    type: "address";
    internalType: "address";
  }>;
}>;

export const FN_SELECTOR = "0x14a7a34b" as const;
const FN_INPUTS = [
  {
    name: "_currentExtensionImplementation",
    type: "address",
    internalType: "address",
  },
  {
    name: "_newExtensionImplementation",
    type: "address",
    internalType: "address",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `updateExtension` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `updateExtension` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isUpdateExtensionSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isUpdateExtensionSupported(contract);
 * ```
 */
export async function isUpdateExtensionSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "updateExtension" function.
 * @param options - The options for the updateExtension function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeUpdateExtensionParams } "thirdweb/extensions/modular";
 * const result = encodeUpdateExtensionParams({
 *  currentExtensionImplementation: ...,
 *  newExtensionImplementation: ...,
 * });
 * ```
 */
export function encodeUpdateExtensionParams(options: UpdateExtensionParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.currentExtensionImplementation,
    options.newExtensionImplementation,
  ]);
}

/**
 * Encodes the "updateExtension" function into a Hex string with its parameters.
 * @param options - The options for the updateExtension function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeUpdateExtension } "thirdweb/extensions/modular";
 * const result = encodeUpdateExtension({
 *  currentExtensionImplementation: ...,
 *  newExtensionImplementation: ...,
 * });
 * ```
 */
export function encodeUpdateExtension(options: UpdateExtensionParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeUpdateExtensionParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "updateExtension" function on the contract.
 * @param options - The options for the "updateExtension" function.
 * @returns A prepared transaction object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { updateExtension } from "thirdweb/extensions/modular";
 *
 * const transaction = updateExtension({
 *  contract,
 *  currentExtensionImplementation: ...,
 *  newExtensionImplementation: ...,
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
export function updateExtension(
  options: BaseTransactionOptions<
    | UpdateExtensionParams
    | {
        asyncParams: () => Promise<UpdateExtensionParams>;
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
        resolvedOptions.currentExtensionImplementation,
        resolvedOptions.newExtensionImplementation,
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
