import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "ownerOf" function.
 */
export type OwnerOfParams = {
  tokenId: AbiParameterToPrimitiveType<{
    name: "tokenId";
    type: "uint256";
    internalType: "uint256";
  }>;
};

export const FN_SELECTOR = "0x6352211e" as const;
const FN_INPUTS = [
  {
    name: "tokenId",
    type: "uint256",
    internalType: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "address",
    internalType: "address",
  },
] as const;

/**
 * Checks if the `ownerOf` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `ownerOf` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isOwnerOfSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isOwnerOfSupported(contract);
 * ```
 */
export async function isOwnerOfSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "ownerOf" function.
 * @param options - The options for the ownerOf function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeOwnerOfParams } "thirdweb/extensions/modular";
 * const result = encodeOwnerOfParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeOwnerOfParams(options: OwnerOfParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Encodes the "ownerOf" function into a Hex string with its parameters.
 * @param options - The options for the ownerOf function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeOwnerOf } "thirdweb/extensions/modular";
 * const result = encodeOwnerOf({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeOwnerOf(options: OwnerOfParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeOwnerOfParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the ownerOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeOwnerOfResult } from "thirdweb/extensions/modular";
 * const result = decodeOwnerOfResult("...");
 * ```
 */
export function decodeOwnerOfResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "ownerOf" function on the contract.
 * @param options - The options for the ownerOf function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { ownerOf } from "thirdweb/extensions/modular";
 *
 * const result = await ownerOf({
 *  contract,
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function ownerOf(options: BaseTransactionOptions<OwnerOfParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId],
  });
}
