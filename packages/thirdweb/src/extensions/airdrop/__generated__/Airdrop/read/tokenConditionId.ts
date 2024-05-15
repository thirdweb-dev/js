import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "tokenConditionId" function.
 */
export type TokenConditionIdParams = {
  tokenAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "tokenAddress";
  }>;
};

export const FN_SELECTOR = "0x3dc28d49" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "tokenAddress",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `tokenConditionId` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `tokenConditionId` method is supported.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { isTokenConditionIdSupported } from "thirdweb/extensions/airdrop";
 *
 * const supported = await isTokenConditionIdSupported(contract);
 * ```
 */
export async function isTokenConditionIdSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "tokenConditionId" function.
 * @param options - The options for the tokenConditionId function.
 * @returns The encoded ABI parameters.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeTokenConditionIdParams } "thirdweb/extensions/airdrop";
 * const result = encodeTokenConditionIdParams({
 *  tokenAddress: ...,
 * });
 * ```
 */
export function encodeTokenConditionIdParams(options: TokenConditionIdParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenAddress]);
}

/**
 * Encodes the "tokenConditionId" function into a Hex string with its parameters.
 * @param options - The options for the tokenConditionId function.
 * @returns The encoded hexadecimal string.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeTokenConditionId } "thirdweb/extensions/airdrop";
 * const result = encodeTokenConditionId({
 *  tokenAddress: ...,
 * });
 * ```
 */
export function encodeTokenConditionId(options: TokenConditionIdParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeTokenConditionIdParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the tokenConditionId function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { decodeTokenConditionIdResult } from "thirdweb/extensions/airdrop";
 * const result = decodeTokenConditionIdResult("...");
 * ```
 */
export function decodeTokenConditionIdResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "tokenConditionId" function on the contract.
 * @param options - The options for the tokenConditionId function.
 * @returns The parsed result of the function call.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { tokenConditionId } from "thirdweb/extensions/airdrop";
 *
 * const result = await tokenConditionId({
 *  contract,
 *  tokenAddress: ...,
 * });
 *
 * ```
 */
export async function tokenConditionId(
  options: BaseTransactionOptions<TokenConditionIdParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenAddress],
  });
}
