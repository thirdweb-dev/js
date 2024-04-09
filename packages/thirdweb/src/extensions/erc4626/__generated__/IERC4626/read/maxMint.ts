import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "maxMint" function.
 */
export type MaxMintParams = {
  receiver: AbiParameterToPrimitiveType<{
    name: "receiver";
    type: "address";
    internalType: "address";
  }>;
};

export const FN_SELECTOR = "0xc63d75b6" as const;
const FN_INPUTS = [
  {
    name: "receiver",
    type: "address",
    internalType: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "maxShares",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Encodes the parameters for the "maxMint" function.
 * @param options - The options for the maxMint function.
 * @returns The encoded ABI parameters.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeMaxMintParams } "thirdweb/extensions/erc4626";
 * const result = encodeMaxMintParams({
 *  receiver: ...,
 * });
 * ```
 */
export function encodeMaxMintParams(options: MaxMintParams) {
  return encodeAbiParameters(FN_INPUTS, [options.receiver]);
}

/**
 * Decodes the result of the maxMint function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4626
 * @example
 * ```ts
 * import { decodeMaxMintResult } from "thirdweb/extensions/erc4626";
 * const result = decodeMaxMintResult("...");
 * ```
 */
export function decodeMaxMintResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "maxMint" function on the contract.
 * @param options - The options for the maxMint function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```ts
 * import { maxMint } from "thirdweb/extensions/erc4626";
 *
 * const result = await maxMint({
 *  receiver: ...,
 * });
 *
 * ```
 */
export async function maxMint(options: BaseTransactionOptions<MaxMintParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.receiver],
  });
}
