import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getAllAuctions" function.
 */
export type GetAllAuctionsParams = {
  startId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_startId" }>;
  endId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_endId" }>;
};

export const FN_SELECTOR = "0xc291537c" as const;
const FN_INPUTS = [
  {
    name: "_startId",
    type: "uint256",
  },
  {
    name: "_endId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "auctionId",
        type: "uint256",
      },
      {
        name: "tokenId",
        type: "uint256",
      },
      {
        name: "quantity",
        type: "uint256",
      },
      {
        name: "minimumBidAmount",
        type: "uint256",
      },
      {
        name: "buyoutBidAmount",
        type: "uint256",
      },
      {
        name: "timeBufferInSeconds",
        type: "uint64",
      },
      {
        name: "bidBufferBps",
        type: "uint64",
      },
      {
        name: "startTimestamp",
        type: "uint64",
      },
      {
        name: "endTimestamp",
        type: "uint64",
      },
      {
        name: "auctionCreator",
        type: "address",
      },
      {
        name: "assetContract",
        type: "address",
      },
      {
        name: "currency",
        type: "address",
      },
      {
        name: "tokenType",
        type: "uint8",
      },
      {
        name: "status",
        type: "uint8",
      },
    ],
    name: "auctions",
    type: "tuple[]",
  },
] as const;

/**
 * Checks if the `getAllAuctions` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getAllAuctions` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isGetAllAuctionsSupported } from "thirdweb/extensions/marketplace";
 * const supported = isGetAllAuctionsSupported(["0x..."]);
 * ```
 */
export function isGetAllAuctionsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getAllAuctions" function.
 * @param options - The options for the getAllAuctions function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetAllAuctionsParams } from "thirdweb/extensions/marketplace";
 * const result = encodeGetAllAuctionsParams({
 *  startId: ...,
 *  endId: ...,
 * });
 * ```
 */
export function encodeGetAllAuctionsParams(options: GetAllAuctionsParams) {
  return encodeAbiParameters(FN_INPUTS, [options.startId, options.endId]);
}

/**
 * Encodes the "getAllAuctions" function into a Hex string with its parameters.
 * @param options - The options for the getAllAuctions function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetAllAuctions } from "thirdweb/extensions/marketplace";
 * const result = encodeGetAllAuctions({
 *  startId: ...,
 *  endId: ...,
 * });
 * ```
 */
export function encodeGetAllAuctions(options: GetAllAuctionsParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetAllAuctionsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getAllAuctions function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeGetAllAuctionsResult } from "thirdweb/extensions/marketplace";
 * const result = decodeGetAllAuctionsResultResult("...");
 * ```
 */
export function decodeGetAllAuctionsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAllAuctions" function on the contract.
 * @param options - The options for the getAllAuctions function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getAllAuctions } from "thirdweb/extensions/marketplace";
 *
 * const result = await getAllAuctions({
 *  contract,
 *  startId: ...,
 *  endId: ...,
 * });
 *
 * ```
 */
export async function getAllAuctions(
  options: BaseTransactionOptions<GetAllAuctionsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.startId, options.endId],
  });
}
