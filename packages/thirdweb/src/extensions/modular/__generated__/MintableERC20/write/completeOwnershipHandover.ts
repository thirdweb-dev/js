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
 * Represents the parameters for the "completeOwnershipHandover" function.
 */
export type CompleteOwnershipHandoverParams = WithOverrides<{
  pendingOwner: AbiParameterToPrimitiveType<{
    name: "pendingOwner";
    type: "address";
    internalType: "address";
  }>;
}>;

export const FN_SELECTOR = "0xf04e283e" as const;
const FN_INPUTS = [
  {
    name: "pendingOwner",
    type: "address",
    internalType: "address",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `completeOwnershipHandover` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `completeOwnershipHandover` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isCompleteOwnershipHandoverSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isCompleteOwnershipHandoverSupported(contract);
 * ```
 */
export async function isCompleteOwnershipHandoverSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "completeOwnershipHandover" function.
 * @param options - The options for the completeOwnershipHandover function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeCompleteOwnershipHandoverParams } "thirdweb/extensions/modular";
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
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeCompleteOwnershipHandover } "thirdweb/extensions/modular";
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
 * @extension MODULAR
 * @example
 * ```ts
 * import { completeOwnershipHandover } from "thirdweb/extensions/modular";
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
 * ...
 *
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
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.pendingOwner] as const;
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
