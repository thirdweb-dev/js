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
    name: "_rulesEngineAddress",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setRulesEngineOverride` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setRulesEngineOverride` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isSetRulesEngineOverrideSupported } from "thirdweb/extensions/thirdweb";
 *
 * const supported = isSetRulesEngineOverrideSupported(["0x..."]);
 * ```
 */
export function isSetRulesEngineOverrideSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
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
 * import { encodeSetRulesEngineOverrideParams } from "thirdweb/extensions/thirdweb";
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
 * import { encodeSetRulesEngineOverride } from "thirdweb/extensions/thirdweb";
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
 * import { sendTransaction } from "thirdweb";
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
 * await sendTransaction({ transaction, account });
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
      return [resolvedOptions.rulesEngineAddress] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
