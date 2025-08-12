import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isClaimed" function.
 */
export type IsClaimedParams = {
  receiver: AbiParameterToPrimitiveType<{ type: "address"; name: "_receiver" }>;
  token: AbiParameterToPrimitiveType<{ type: "address"; name: "_token" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
};

export const FN_SELECTOR = "0xd12acf73" as const;
const FN_INPUTS = [
  {
    name: "_receiver",
    type: "address",
  },
  {
    name: "_token",
    type: "address",
  },
  {
    name: "_tokenId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `isClaimed` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isClaimed` method is supported.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { isIsClaimedSupported } from "thirdweb/extensions/airdrop";
 * const supported = isIsClaimedSupported(["0x..."]);
 * ```
 */
export function isIsClaimedSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isClaimed" function.
 * @param options - The options for the isClaimed function.
 * @returns The encoded ABI parameters.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeIsClaimedParams } from "thirdweb/extensions/airdrop";
 * const result = encodeIsClaimedParams({
 *  receiver: ...,
 *  token: ...,
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeIsClaimedParams(options: IsClaimedParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.receiver,
    options.token,
    options.tokenId,
  ]);
}

/**
 * Encodes the "isClaimed" function into a Hex string with its parameters.
 * @param options - The options for the isClaimed function.
 * @returns The encoded hexadecimal string.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeIsClaimed } from "thirdweb/extensions/airdrop";
 * const result = encodeIsClaimed({
 *  receiver: ...,
 *  token: ...,
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeIsClaimed(options: IsClaimedParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsClaimedParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isClaimed function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { decodeIsClaimedResult } from "thirdweb/extensions/airdrop";
 * const result = decodeIsClaimedResultResult("...");
 * ```
 */
export function decodeIsClaimedResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isClaimed" function on the contract.
 * @param options - The options for the isClaimed function.
 * @returns The parsed result of the function call.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { isClaimed } from "thirdweb/extensions/airdrop";
 *
 * const result = await isClaimed({
 *  contract,
 *  receiver: ...,
 *  token: ...,
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function isClaimed(
  options: BaseTransactionOptions<IsClaimedParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.receiver, options.token, options.tokenId],
  });
}
