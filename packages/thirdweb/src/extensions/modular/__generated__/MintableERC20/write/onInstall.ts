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
 * Represents the parameters for the "onInstall" function.
 */
export type OnInstallParams = WithOverrides<{
  data: AbiParameterToPrimitiveType<{
    name: "data";
    type: "bytes";
    internalType: "bytes";
  }>;
}>;

export const FN_SELECTOR = "0x6d61fe70" as const;
const FN_INPUTS = [
  {
    name: "data",
    type: "bytes",
    internalType: "bytes",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `onInstall` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `onInstall` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isOnInstallSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isOnInstallSupported(contract);
 * ```
 */
export async function isOnInstallSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "onInstall" function.
 * @param options - The options for the onInstall function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeOnInstallParams } "thirdweb/extensions/modular";
 * const result = encodeOnInstallParams({
 *  data: ...,
 * });
 * ```
 */
export function encodeOnInstallParams(options: OnInstallParams) {
  return encodeAbiParameters(FN_INPUTS, [options.data]);
}

/**
 * Encodes the "onInstall" function into a Hex string with its parameters.
 * @param options - The options for the onInstall function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeOnInstall } "thirdweb/extensions/modular";
 * const result = encodeOnInstall({
 *  data: ...,
 * });
 * ```
 */
export function encodeOnInstall(options: OnInstallParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeOnInstallParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "onInstall" function on the contract.
 * @param options - The options for the "onInstall" function.
 * @returns A prepared transaction object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { onInstall } from "thirdweb/extensions/modular";
 *
 * const transaction = onInstall({
 *  contract,
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
export function onInstall(
  options: BaseTransactionOptions<
    | OnInstallParams
    | {
        asyncParams: () => Promise<OnInstallParams>;
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
      return [resolvedOptions.data] as const;
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
