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
 * Represents the parameters for the "setPrimarySaleRecipient" function.
 */
export type SetPrimarySaleRecipientParams = WithOverrides<{
  saleRecipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_saleRecipient";
  }>;
}>;

export const FN_SELECTOR = "0x6f4f2837" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_saleRecipient",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setPrimarySaleRecipient` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setPrimarySaleRecipient` method is supported.
 * @extension COMMON
 * @example
 * ```ts
 * import { isSetPrimarySaleRecipientSupported } from "thirdweb/extensions/common";
 *
 * const supported = isSetPrimarySaleRecipientSupported(["0x..."]);
 * ```
 */
export function isSetPrimarySaleRecipientSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setPrimarySaleRecipient" function.
 * @param options - The options for the setPrimarySaleRecipient function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeSetPrimarySaleRecipientParams } from "thirdweb/extensions/common";
 * const result = encodeSetPrimarySaleRecipientParams({
 *  saleRecipient: ...,
 * });
 * ```
 */
export function encodeSetPrimarySaleRecipientParams(
  options: SetPrimarySaleRecipientParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.saleRecipient]);
}

/**
 * Encodes the "setPrimarySaleRecipient" function into a Hex string with its parameters.
 * @param options - The options for the setPrimarySaleRecipient function.
 * @returns The encoded hexadecimal string.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeSetPrimarySaleRecipient } from "thirdweb/extensions/common";
 * const result = encodeSetPrimarySaleRecipient({
 *  saleRecipient: ...,
 * });
 * ```
 */
export function encodeSetPrimarySaleRecipient(
  options: SetPrimarySaleRecipientParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetPrimarySaleRecipientParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setPrimarySaleRecipient" function on the contract.
 * @param options - The options for the "setPrimarySaleRecipient" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { setPrimarySaleRecipient } from "thirdweb/extensions/common";
 *
 * const transaction = setPrimarySaleRecipient({
 *  contract,
 *  saleRecipient: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function setPrimarySaleRecipient(
  options: BaseTransactionOptions<
    | SetPrimarySaleRecipientParams
    | {
        asyncParams: () => Promise<SetPrimarySaleRecipientParams>;
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
      return [resolvedOptions.saleRecipient] as const;
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
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
  });
}
