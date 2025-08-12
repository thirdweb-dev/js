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
    name: "_royaltyEngineAddress",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setRoyaltyEngine` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setRoyaltyEngine` method is supported.
 * @extension COMMON
 * @example
 * ```ts
 * import { isSetRoyaltyEngineSupported } from "thirdweb/extensions/common";
 *
 * const supported = isSetRoyaltyEngineSupported(["0x..."]);
 * ```
 */
export function isSetRoyaltyEngineSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
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
 * import { encodeSetRoyaltyEngineParams } from "thirdweb/extensions/common";
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
 * import { encodeSetRoyaltyEngine } from "thirdweb/extensions/common";
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
 * import { sendTransaction } from "thirdweb";
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
 * await sendTransaction({ transaction, account });
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
      return [resolvedOptions.royaltyEngineAddress] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
