import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "tokenMerkleRoot" function.
 */
export type TokenMerkleRootParams = {
  tokenAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "tokenAddress";
  }>;
};

export const FN_SELECTOR = "0x95f5c120" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "tokenAddress",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes32",
  },
] as const;

/**
 * Checks if the `tokenMerkleRoot` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `tokenMerkleRoot` method is supported.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { isTokenMerkleRootSupported } from "thirdweb/extensions/airdrop";
 *
 * const supported = await isTokenMerkleRootSupported(contract);
 * ```
 */
export async function isTokenMerkleRootSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "tokenMerkleRoot" function.
 * @param options - The options for the tokenMerkleRoot function.
 * @returns The encoded ABI parameters.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeTokenMerkleRootParams } "thirdweb/extensions/airdrop";
 * const result = encodeTokenMerkleRootParams({
 *  tokenAddress: ...,
 * });
 * ```
 */
export function encodeTokenMerkleRootParams(options: TokenMerkleRootParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenAddress]);
}

/**
 * Encodes the "tokenMerkleRoot" function into a Hex string with its parameters.
 * @param options - The options for the tokenMerkleRoot function.
 * @returns The encoded hexadecimal string.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeTokenMerkleRoot } "thirdweb/extensions/airdrop";
 * const result = encodeTokenMerkleRoot({
 *  tokenAddress: ...,
 * });
 * ```
 */
export function encodeTokenMerkleRoot(options: TokenMerkleRootParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeTokenMerkleRootParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the tokenMerkleRoot function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { decodeTokenMerkleRootResult } from "thirdweb/extensions/airdrop";
 * const result = decodeTokenMerkleRootResult("...");
 * ```
 */
export function decodeTokenMerkleRootResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "tokenMerkleRoot" function on the contract.
 * @param options - The options for the tokenMerkleRoot function.
 * @returns The parsed result of the function call.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { tokenMerkleRoot } from "thirdweb/extensions/airdrop";
 *
 * const result = await tokenMerkleRoot({
 *  contract,
 *  tokenAddress: ...,
 * });
 *
 * ```
 */
export async function tokenMerkleRoot(
  options: BaseTransactionOptions<TokenMerkleRootParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenAddress],
  });
}
