import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getAllValidAuctions" function.
 */
export type GetAllValidAuctionsParams = {
  startId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_startId" }>;
  endId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_endId" }>;
};

export const FN_SELECTOR = "0x7b063801" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_startId",
  },
  {
    type: "uint256",
    name: "_endId",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "tuple[]",
    name: "auctions",
    components: [
      {
        type: "uint256",
        name: "auctionId",
      },
      {
        type: "uint256",
        name: "tokenId",
      },
      {
        type: "uint256",
        name: "quantity",
      },
      {
        type: "uint256",
        name: "minimumBidAmount",
      },
      {
        type: "uint256",
        name: "buyoutBidAmount",
      },
      {
        type: "uint64",
        name: "timeBufferInSeconds",
      },
      {
        type: "uint64",
        name: "bidBufferBps",
      },
      {
        type: "uint64",
        name: "startTimestamp",
      },
      {
        type: "uint64",
        name: "endTimestamp",
      },
      {
        type: "address",
        name: "auctionCreator",
      },
      {
        type: "address",
        name: "assetContract",
      },
      {
        type: "address",
        name: "currency",
      },
      {
        type: "uint8",
        name: "tokenType",
      },
      {
        type: "uint8",
        name: "status",
      },
    ],
  },
] as const;

/**
 * Checks if the `getAllValidAuctions` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getAllValidAuctions` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isGetAllValidAuctionsSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = await isGetAllValidAuctionsSupported(contract);
 * ```
 */
export async function isGetAllValidAuctionsSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getAllValidAuctions" function.
 * @param options - The options for the getAllValidAuctions function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetAllValidAuctionsParams } "thirdweb/extensions/marketplace";
 * const result = encodeGetAllValidAuctionsParams({
 *  startId: ...,
 *  endId: ...,
 * });
 * ```
 */
export function encodeGetAllValidAuctionsParams(
  options: GetAllValidAuctionsParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.startId, options.endId]);
}

/**
 * Encodes the "getAllValidAuctions" function into a Hex string with its parameters.
 * @param options - The options for the getAllValidAuctions function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetAllValidAuctions } "thirdweb/extensions/marketplace";
 * const result = encodeGetAllValidAuctions({
 *  startId: ...,
 *  endId: ...,
 * });
 * ```
 */
export function encodeGetAllValidAuctions(options: GetAllValidAuctionsParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetAllValidAuctionsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getAllValidAuctions function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeGetAllValidAuctionsResult } from "thirdweb/extensions/marketplace";
 * const result = decodeGetAllValidAuctionsResult("...");
 * ```
 */
export function decodeGetAllValidAuctionsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAllValidAuctions" function on the contract.
 * @param options - The options for the getAllValidAuctions function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getAllValidAuctions } from "thirdweb/extensions/marketplace";
 *
 * const result = await getAllValidAuctions({
 *  contract,
 *  startId: ...,
 *  endId: ...,
 * });
 *
 * ```
 */
export async function getAllValidAuctions(
  options: BaseTransactionOptions<GetAllValidAuctionsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.startId, options.endId],
  });
}
