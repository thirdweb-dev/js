import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getApproved" function.
 */
export type GetApprovedParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

export const FN_SELECTOR = "0x081812fc" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "tokenId",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `getApproved` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getApproved` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isGetApprovedSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = await isGetApprovedSupported(contract);
 * ```
 */
export async function isGetApprovedSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getApproved" function.
 * @param options - The options for the getApproved function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeGetApprovedParams } "thirdweb/extensions/erc721";
 * const result = encodeGetApprovedParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetApprovedParams(options: GetApprovedParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Encodes the "getApproved" function into a Hex string with its parameters.
 * @param options - The options for the getApproved function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeGetApproved } "thirdweb/extensions/erc721";
 * const result = encodeGetApproved({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetApproved(options: GetApprovedParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetApprovedParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getApproved function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeGetApprovedResult } from "thirdweb/extensions/erc721";
 * const result = decodeGetApprovedResult("...");
 * ```
 */
export function decodeGetApprovedResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getApproved" function on the contract.
 * @param options - The options for the getApproved function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { getApproved } from "thirdweb/extensions/erc721";
 *
 * const result = await getApproved({
 *  contract,
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getApproved(
  options: BaseTransactionOptions<GetApprovedParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId],
  });
}
