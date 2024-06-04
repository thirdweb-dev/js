import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "ownershipHandoverExpiresAt" function.
 */
export type OwnershipHandoverExpiresAtParams = {
  pendingOwner: AbiParameterToPrimitiveType<{
    name: "pendingOwner";
    type: "address";
    internalType: "address";
  }>;
};

export const FN_SELECTOR = "0xfee81cf4" as const;
const FN_INPUTS = [
  {
    name: "pendingOwner",
    type: "address",
    internalType: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "result",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Checks if the `ownershipHandoverExpiresAt` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `ownershipHandoverExpiresAt` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isOwnershipHandoverExpiresAtSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isOwnershipHandoverExpiresAtSupported(contract);
 * ```
 */
export async function isOwnershipHandoverExpiresAtSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "ownershipHandoverExpiresAt" function.
 * @param options - The options for the ownershipHandoverExpiresAt function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeOwnershipHandoverExpiresAtParams } "thirdweb/extensions/modular";
 * const result = encodeOwnershipHandoverExpiresAtParams({
 *  pendingOwner: ...,
 * });
 * ```
 */
export function encodeOwnershipHandoverExpiresAtParams(
  options: OwnershipHandoverExpiresAtParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.pendingOwner]);
}

/**
 * Encodes the "ownershipHandoverExpiresAt" function into a Hex string with its parameters.
 * @param options - The options for the ownershipHandoverExpiresAt function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeOwnershipHandoverExpiresAt } "thirdweb/extensions/modular";
 * const result = encodeOwnershipHandoverExpiresAt({
 *  pendingOwner: ...,
 * });
 * ```
 */
export function encodeOwnershipHandoverExpiresAt(
  options: OwnershipHandoverExpiresAtParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeOwnershipHandoverExpiresAtParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the ownershipHandoverExpiresAt function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeOwnershipHandoverExpiresAtResult } from "thirdweb/extensions/modular";
 * const result = decodeOwnershipHandoverExpiresAtResult("...");
 * ```
 */
export function decodeOwnershipHandoverExpiresAtResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "ownershipHandoverExpiresAt" function on the contract.
 * @param options - The options for the ownershipHandoverExpiresAt function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { ownershipHandoverExpiresAt } from "thirdweb/extensions/modular";
 *
 * const result = await ownershipHandoverExpiresAt({
 *  contract,
 *  pendingOwner: ...,
 * });
 *
 * ```
 */
export async function ownershipHandoverExpiresAt(
  options: BaseTransactionOptions<OwnershipHandoverExpiresAtParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.pendingOwner],
  });
}
