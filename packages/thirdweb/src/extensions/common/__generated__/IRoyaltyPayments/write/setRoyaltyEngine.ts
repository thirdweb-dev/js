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
 * Represents the parameters for the "setRoyaltyEngine" function.
 */
export type SetRoyaltyEngineParams = WithOverrides<{
  royaltyEngineAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_royaltyEngineAddress";
  }>;
}>;

export const FN_SELECTOR = "0x21ede032" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_royaltyEngineAddress",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setRoyaltyEngine` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `setRoyaltyEngine` method is supported.
 * @extension COMMON
 * @example
 * ```ts
 * import { isSetRoyaltyEngineSupported } from "thirdweb/extensions/common";
 *
 * const supported = await isSetRoyaltyEngineSupported(contract);
 * ```
 */
export async function isSetRoyaltyEngineSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setRoyaltyEngine" function.
 * @param options - The options for the setRoyaltyEngine function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeSetRoyaltyEngineParams } "thirdweb/extensions/common";
 * const result = encodeSetRoyaltyEngineParams({
 *  royaltyEngineAddress: ...,
 * });
 * ```
 */
export function encodeSetRoyaltyEngineParams(options: SetRoyaltyEngineParams) {
  return encodeAbiParameters(FN_INPUTS, [options.royaltyEngineAddress]);
}

/**
 * Encodes the "setRoyaltyEngine" function into a Hex string with its parameters.
 * @param options - The options for the setRoyaltyEngine function.
 * @returns The encoded hexadecimal string.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeSetRoyaltyEngine } "thirdweb/extensions/common";
 * const result = encodeSetRoyaltyEngine({
 *  royaltyEngineAddress: ...,
 * });
 * ```
 */
export function encodeSetRoyaltyEngine(options: SetRoyaltyEngineParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetRoyaltyEngineParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setRoyaltyEngine" function on the contract.
 * @param options - The options for the "setRoyaltyEngine" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```ts
 * import { setRoyaltyEngine } from "thirdweb/extensions/common";
 *
 * const transaction = setRoyaltyEngine({
 *  contract,
 *  royaltyEngineAddress: ...,
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
export function setRoyaltyEngine(
  options: BaseTransactionOptions<
    | SetRoyaltyEngineParams
    | {
        asyncParams: () => Promise<SetRoyaltyEngineParams>;
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
      return [resolvedOptions.royaltyEngineAddress] as const;
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
