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
 * Represents the parameters for the "setRulesEngineOverride" function.
 */
export type SetRulesEngineOverrideParams = WithOverrides<{
  rulesEngineAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_rulesEngineAddress";
  }>;
}>;

export const FN_SELECTOR = "0x0eb0adb6" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_rulesEngineAddress",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setRulesEngineOverride` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `setRulesEngineOverride` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isSetRulesEngineOverrideSupported } from "thirdweb/extensions/thirdweb";
 *
 * const supported = await isSetRulesEngineOverrideSupported(contract);
 * ```
 */
export async function isSetRulesEngineOverrideSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setRulesEngineOverride" function.
 * @param options - The options for the setRulesEngineOverride function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeSetRulesEngineOverrideParams } "thirdweb/extensions/thirdweb";
 * const result = encodeSetRulesEngineOverrideParams({
 *  rulesEngineAddress: ...,
 * });
 * ```
 */
export function encodeSetRulesEngineOverrideParams(
  options: SetRulesEngineOverrideParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.rulesEngineAddress]);
}

/**
 * Encodes the "setRulesEngineOverride" function into a Hex string with its parameters.
 * @param options - The options for the setRulesEngineOverride function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeSetRulesEngineOverride } "thirdweb/extensions/thirdweb";
 * const result = encodeSetRulesEngineOverride({
 *  rulesEngineAddress: ...,
 * });
 * ```
 */
export function encodeSetRulesEngineOverride(
  options: SetRulesEngineOverrideParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetRulesEngineOverrideParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setRulesEngineOverride" function on the contract.
 * @param options - The options for the "setRulesEngineOverride" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { setRulesEngineOverride } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = setRulesEngineOverride({
 *  contract,
 *  rulesEngineAddress: ...,
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
export function setRulesEngineOverride(
  options: BaseTransactionOptions<
    | SetRulesEngineOverrideParams
    | {
        asyncParams: () => Promise<SetRulesEngineOverrideParams>;
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
      return [resolvedOptions.rulesEngineAddress] as const;
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
