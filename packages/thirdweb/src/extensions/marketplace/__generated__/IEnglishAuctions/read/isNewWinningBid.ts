import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "isNewWinningBid" function.
 */
export type IsNewWinningBidParams = {
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
  bidAmount: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_bidAmount";
  }>;
};

export const FN_SELECTOR = "0x2eb566bd" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_auctionId",
  },
  {
    type: "uint256",
    name: "_bidAmount",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `isNewWinningBid` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `isNewWinningBid` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isIsNewWinningBidSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = await isIsNewWinningBidSupported(contract);
 * ```
 */
export async function isIsNewWinningBidSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isNewWinningBid" function.
 * @param options - The options for the isNewWinningBid function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeIsNewWinningBidParams } "thirdweb/extensions/marketplace";
 * const result = encodeIsNewWinningBidParams({
 *  auctionId: ...,
 *  bidAmount: ...,
 * });
 * ```
 */
export function encodeIsNewWinningBidParams(options: IsNewWinningBidParams) {
  return encodeAbiParameters(FN_INPUTS, [options.auctionId, options.bidAmount]);
}

/**
 * Encodes the "isNewWinningBid" function into a Hex string with its parameters.
 * @param options - The options for the isNewWinningBid function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeIsNewWinningBid } "thirdweb/extensions/marketplace";
 * const result = encodeIsNewWinningBid({
 *  auctionId: ...,
 *  bidAmount: ...,
 * });
 * ```
 */
export function encodeIsNewWinningBid(options: IsNewWinningBidParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsNewWinningBidParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isNewWinningBid function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeIsNewWinningBidResult } from "thirdweb/extensions/marketplace";
 * const result = decodeIsNewWinningBidResult("...");
 * ```
 */
export function decodeIsNewWinningBidResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isNewWinningBid" function on the contract.
 * @param options - The options for the isNewWinningBid function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isNewWinningBid } from "thirdweb/extensions/marketplace";
 *
 * const result = await isNewWinningBid({
 *  contract,
 *  auctionId: ...,
 *  bidAmount: ...,
 * });
 *
 * ```
 */
export async function isNewWinningBid(
  options: BaseTransactionOptions<IsNewWinningBidParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.auctionId, options.bidAmount],
  });
}
