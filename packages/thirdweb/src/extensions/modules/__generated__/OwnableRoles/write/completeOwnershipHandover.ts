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
 * Represents the parameters for the "completeOwnershipHandover" function.
 */
export type CompleteOwnershipHandoverParams = WithOverrides<{
  pendingOwner: AbiParameterToPrimitiveType<{
    type: "address";
    name: "pendingOwner";
  }>;
}>;

export const FN_SELECTOR = "0xf04e283e" as const;
const FN_INPUTS = [
  {
    name: "pendingOwner",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `completeOwnershipHandover` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `completeOwnershipHandover` method is supported.
 * @extension MODULES
 * @example
 * ```ts
 * import { isCompleteOwnershipHandoverSupported } from "thirdweb/extensions/modules";
 *
 * const supported = isCompleteOwnershipHandoverSupported(["0x..."]);
 * ```
 */
export function isCompleteOwnershipHandoverSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "completeOwnershipHandover" function.
 * @param options - The options for the completeOwnershipHandover function.
 * @returns The encoded ABI parameters.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeCompleteOwnershipHandoverParams } from "thirdweb/extensions/modules";
 * const result = encodeCompleteOwnershipHandoverParams({
 *  pendingOwner: ...,
 * });
 * ```
 */
export function encodeCompleteOwnershipHandoverParams(
  options: CompleteOwnershipHandoverParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.pendingOwner]);
}

/**
 * Encodes the "completeOwnershipHandover" function into a Hex string with its parameters.
 * @param options - The options for the completeOwnershipHandover function.
 * @returns The encoded hexadecimal string.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeCompleteOwnershipHandover } from "thirdweb/extensions/modules";
 * const result = encodeCompleteOwnershipHandover({
 *  pendingOwner: ...,
 * });
 * ```
 */
export function encodeCompleteOwnershipHandover(
  options: CompleteOwnershipHandoverParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCompleteOwnershipHandoverParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "completeOwnershipHandover" function on the contract.
 * @param options - The options for the "completeOwnershipHandover" function.
 * @returns A prepared transaction object.
 * @extension MODULES
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { completeOwnershipHandover } from "thirdweb/extensions/modules";
 *
 * const transaction = completeOwnershipHandover({
 *  contract,
 *  pendingOwner: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function completeOwnershipHandover(
  options: BaseTransactionOptions<
    | CompleteOwnershipHandoverParams
    | {
        asyncParams: () => Promise<CompleteOwnershipHandoverParams>;
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
      return [resolvedOptions.pendingOwner] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
