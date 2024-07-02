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
 * Represents the parameters for the "setSaleConfig" function.
 */
export type SetSaleConfigParams = WithOverrides<{
  primarySaleRecipient: AbiParameterToPrimitiveType<{
    name: "_primarySaleRecipient";
    type: "address";
    internalType: "address";
  }>;
}>;

export const FN_SELECTOR = "0xd29a3628" as const;
const FN_INPUTS = [
  {
    name: "_primarySaleRecipient",
    type: "address",
    internalType: "address",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setSaleConfig` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `setSaleConfig` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isSetSaleConfigSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isSetSaleConfigSupported(contract);
 * ```
 */
export async function isSetSaleConfigSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setSaleConfig" function.
 * @param options - The options for the setSaleConfig function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeSetSaleConfigParams } "thirdweb/extensions/modular";
 * const result = encodeSetSaleConfigParams({
 *  primarySaleRecipient: ...,
 * });
 * ```
 */
export function encodeSetSaleConfigParams(options: SetSaleConfigParams) {
  return encodeAbiParameters(FN_INPUTS, [options.primarySaleRecipient]);
}

/**
 * Encodes the "setSaleConfig" function into a Hex string with its parameters.
 * @param options - The options for the setSaleConfig function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeSetSaleConfig } "thirdweb/extensions/modular";
 * const result = encodeSetSaleConfig({
 *  primarySaleRecipient: ...,
 * });
 * ```
 */
export function encodeSetSaleConfig(options: SetSaleConfigParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetSaleConfigParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setSaleConfig" function on the contract.
 * @param options - The options for the "setSaleConfig" function.
 * @returns A prepared transaction object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { setSaleConfig } from "thirdweb/extensions/modular";
 *
 * const transaction = setSaleConfig({
 *  contract,
 *  primarySaleRecipient: ...,
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
export function setSaleConfig(
  options: BaseTransactionOptions<
    | SetSaleConfigParams
    | {
        asyncParams: () => Promise<SetSaleConfigParams>;
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
      return [resolvedOptions.primarySaleRecipient] as const;
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
