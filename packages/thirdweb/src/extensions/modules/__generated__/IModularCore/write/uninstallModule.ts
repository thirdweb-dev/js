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
 * Represents the parameters for the "uninstallModule" function.
 */
export type UninstallModuleParams = WithOverrides<{
  moduleContract: AbiParameterToPrimitiveType<{
    type: "address";
    name: "moduleContract";
  }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
}>;

export const FN_SELECTOR = "0x70c109cd" as const;
const FN_INPUTS = [
  {
    name: "moduleContract",
    type: "address",
  },
  {
    name: "data",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `uninstallModule` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `uninstallModule` method is supported.
 * @extension MODULES
 * @example
 * ```ts
 * import { isUninstallModuleSupported } from "thirdweb/extensions/modules";
 *
 * const supported = isUninstallModuleSupported(["0x..."]);
 * ```
 */
export function isUninstallModuleSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "uninstallModule" function.
 * @param options - The options for the uninstallModule function.
 * @returns The encoded ABI parameters.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeUninstallModuleParams } from "thirdweb/extensions/modules";
 * const result = encodeUninstallModuleParams({
 *  moduleContract: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeUninstallModuleParams(options: UninstallModuleParams) {
  return encodeAbiParameters(FN_INPUTS, [options.moduleContract, options.data]);
}

/**
 * Encodes the "uninstallModule" function into a Hex string with its parameters.
 * @param options - The options for the uninstallModule function.
 * @returns The encoded hexadecimal string.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeUninstallModule } from "thirdweb/extensions/modules";
 * const result = encodeUninstallModule({
 *  moduleContract: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeUninstallModule(options: UninstallModuleParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeUninstallModuleParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "uninstallModule" function on the contract.
 * @param options - The options for the "uninstallModule" function.
 * @returns A prepared transaction object.
 * @extension MODULES
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { uninstallModule } from "thirdweb/extensions/modules";
 *
 * const transaction = uninstallModule({
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
export function uninstallModule(
  options: BaseTransactionOptions<
    | UninstallModuleParams
    | {
        asyncParams: () => Promise<UninstallModuleParams>;
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
      return [resolvedOptions.moduleContract, resolvedOptions.data] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
