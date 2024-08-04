import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

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

const FN_SELECTOR = "0xfee81cf4" as const;
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
 * Encodes the parameters for the "ownershipHandoverExpiresAt" function.
 * @param options - The options for the ownershipHandoverExpiresAt function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeOwnershipHandoverExpiresAtParams } "thirdweb/extensions/erc721";
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
 * Decodes the result of the ownershipHandoverExpiresAt function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeOwnershipHandoverExpiresAtResult } from "thirdweb/extensions/erc721";
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
 * @extension ERC721
 * @example
 * ```ts
 * import { ownershipHandoverExpiresAt } from "thirdweb/extensions/erc721";
 *
 * const result = await ownershipHandoverExpiresAt({
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
