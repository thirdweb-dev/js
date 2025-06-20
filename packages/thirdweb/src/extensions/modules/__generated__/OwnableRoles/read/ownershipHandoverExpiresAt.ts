import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "ownershipHandoverExpiresAt" function.
 */
export type OwnershipHandoverExpiresAtParams = {
  pendingOwner: AbiParameterToPrimitiveType<{
    type: "address";
    name: "pendingOwner";
  }>;
};

export const FN_SELECTOR = "0xfee81cf4" as const;
const FN_INPUTS = [
  {
    name: "pendingOwner",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "result",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `ownershipHandoverExpiresAt` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `ownershipHandoverExpiresAt` method is supported.
 * @extension MODULES
 * @example
 * ```ts
 * import { isOwnershipHandoverExpiresAtSupported } from "thirdweb/extensions/modules";
 * const supported = isOwnershipHandoverExpiresAtSupported(["0x..."]);
 * ```
 */
export function isOwnershipHandoverExpiresAtSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "ownershipHandoverExpiresAt" function.
 * @param options - The options for the ownershipHandoverExpiresAt function.
 * @returns The encoded ABI parameters.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeOwnershipHandoverExpiresAtParams } from "thirdweb/extensions/modules";
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
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeOwnershipHandoverExpiresAt } from "thirdweb/extensions/modules";
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
 * @extension MODULES
 * @example
 * ```ts
 * import { decodeOwnershipHandoverExpiresAtResult } from "thirdweb/extensions/modules";
 * const result = decodeOwnershipHandoverExpiresAtResultResult("...");
 * ```
 */
export function decodeOwnershipHandoverExpiresAtResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "ownershipHandoverExpiresAt" function on the contract.
 * @param options - The options for the ownershipHandoverExpiresAt function.
 * @returns The parsed result of the function call.
 * @extension MODULES
 * @example
 * ```ts
 * import { ownershipHandoverExpiresAt } from "thirdweb/extensions/modules";
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
