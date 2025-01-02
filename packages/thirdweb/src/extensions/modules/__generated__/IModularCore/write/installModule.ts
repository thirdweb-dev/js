import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "installModule" function.
 */
export type InstallModuleParams = WithOverrides<{
  moduleContract: AbiParameterToPrimitiveType<{
    type: "address";
    name: "moduleContract";
  }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
}>;

export const FN_SELECTOR = "0x8da798da" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "moduleContract",
  },
  {
    type: "bytes",
    name: "data",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `installModule` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `installModule` method is supported.
 * @extension MODULES
 * @example
 * ```ts
 * import { isInstallModuleSupported } from "thirdweb/extensions/modules";
 *
 * const supported = isInstallModuleSupported(["0x..."]);
 * ```
 */
export function isInstallModuleSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "installModule" function.
 * @param options - The options for the installModule function.
 * @returns The encoded ABI parameters.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeInstallModuleParams } from "thirdweb/extensions/modules";
 * const result = encodeInstallModuleParams({
 *  moduleContract: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeInstallModuleParams(options: InstallModuleParams) {
  return encodeAbiParameters(FN_INPUTS, [options.moduleContract, options.data]);
}

/**
 * Encodes the "installModule" function into a Hex string with its parameters.
 * @param options - The options for the installModule function.
 * @returns The encoded hexadecimal string.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeInstallModule } from "thirdweb/extensions/modules";
 * const result = encodeInstallModule({
 *  moduleContract: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeInstallModule(options: InstallModuleParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeInstallModuleParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "installModule" function on the contract.
 * @param options - The options for the "installModule" function.
 * @returns A prepared transaction object.
 * @extension MODULES
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { installModule } from "thirdweb/extensions/modules";
 *
 * const transaction = installModule({
 *  contract,
 *  moduleContract: ...,
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
export function installModule(
  options: BaseTransactionOptions<
    | InstallModuleParams
    | {
        asyncParams: () => Promise<InstallModuleParams>;
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
      return [resolvedOptions.moduleContract, resolvedOptions.data] as const;
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
  });
}
