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
 * Represents the parameters for the "setOwner" function.
 */
export type SetOwnerParams = WithOverrides<{
  newOwner: AbiParameterToPrimitiveType<{ type: "address"; name: "_newOwner" }>;
}>;

export const FN_SELECTOR = "0x13af4035" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_newOwner",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setOwner` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `setOwner` method is supported.
 * @extension COMMON
 * @example
 * ```ts
 * import { isSetOwnerSupported } from "thirdweb/extensions/common";
 *
 * const supported = await isSetOwnerSupported(contract);
 * ```
 */
export async function isSetOwnerSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setOwner" function.
 * @param options - The options for the setOwner function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeSetOwnerParams } "thirdweb/extensions/common";
 * const result = encodeSetOwnerParams({
 *  newOwner: ...,
 * });
 * ```
 */
export function encodeSetOwnerParams(options: SetOwnerParams) {
  return encodeAbiParameters(FN_INPUTS, [options.newOwner]);
}

/**
 * Encodes the "setOwner" function into a Hex string with its parameters.
 * @param options - The options for the setOwner function.
 * @returns The encoded hexadecimal string.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeSetOwner } "thirdweb/extensions/common";
 * const result = encodeSetOwner({
 *  newOwner: ...,
 * });
 * ```
 */
export function encodeSetOwner(options: SetOwnerParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetOwnerParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setOwner" function on the contract.
 * @param options - The options for the "setOwner" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```ts
 * import { setOwner } from "thirdweb/extensions/common";
 *
 * const transaction = setOwner({
 *  contract,
 *  newOwner: ...,
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
export function setOwner(
  options: BaseTransactionOptions<
    | SetOwnerParams
    | {
        asyncParams: () => Promise<SetOwnerParams>;
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
      return [resolvedOptions.newOwner] as const;
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
