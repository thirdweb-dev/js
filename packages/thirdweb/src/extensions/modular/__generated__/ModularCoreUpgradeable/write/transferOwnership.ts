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
 * Represents the parameters for the "transferOwnership" function.
 */
export type TransferOwnershipParams = WithOverrides<{
  newOwner: AbiParameterToPrimitiveType<{
    name: "newOwner";
    type: "address";
    internalType: "address";
  }>;
}>;

export const FN_SELECTOR = "0xf2fde38b" as const;
const FN_INPUTS = [
  {
    name: "newOwner",
    type: "address",
    internalType: "address",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `transferOwnership` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `transferOwnership` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isTransferOwnershipSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isTransferOwnershipSupported(contract);
 * ```
 */
export async function isTransferOwnershipSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "transferOwnership" function.
 * @param options - The options for the transferOwnership function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeTransferOwnershipParams } "thirdweb/extensions/modular";
 * const result = encodeTransferOwnershipParams({
 *  newOwner: ...,
 * });
 * ```
 */
export function encodeTransferOwnershipParams(
  options: TransferOwnershipParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.newOwner]);
}

/**
 * Encodes the "transferOwnership" function into a Hex string with its parameters.
 * @param options - The options for the transferOwnership function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeTransferOwnership } "thirdweb/extensions/modular";
 * const result = encodeTransferOwnership({
 *  newOwner: ...,
 * });
 * ```
 */
export function encodeTransferOwnership(options: TransferOwnershipParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeTransferOwnershipParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "transferOwnership" function on the contract.
 * @param options - The options for the "transferOwnership" function.
 * @returns A prepared transaction object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { transferOwnership } from "thirdweb/extensions/modular";
 *
 * const transaction = transferOwnership({
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
export function transferOwnership(
  options: BaseTransactionOptions<
    | TransferOwnershipParams
    | {
        asyncParams: () => Promise<TransferOwnershipParams>;
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
