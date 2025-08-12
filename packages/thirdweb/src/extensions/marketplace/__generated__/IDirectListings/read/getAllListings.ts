import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getAllListings" function.
 */
export type GetAllListingsParams = {
  startId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_startId" }>;
  endId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_endId" }>;
};

export const FN_SELECTOR = "0xc5275fb0" as const;
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
        name: "listingId",
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
        name: "pricePerToken",
        type: "uint256",
      },
      {
        name: "startTimestamp",
        type: "uint128",
      },
      {
        name: "endTimestamp",
        type: "uint128",
      },
      {
        name: "listingCreator",
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
      {
        name: "reserved",
        type: "bool",
      },
    ],
    name: "listings",
    type: "tuple[]",
  },
] as const;

/**
 * Checks if the `getAllListings` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getAllListings` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isGetAllListingsSupported } from "thirdweb/extensions/marketplace";
 * const supported = isGetAllListingsSupported(["0x..."]);
 * ```
 */
export function isGetAllListingsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getAllListings" function.
 * @param options - The options for the getAllListings function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetAllListingsParams } from "thirdweb/extensions/marketplace";
 * const result = encodeGetAllListingsParams({
 *  startId: ...,
 *  endId: ...,
 * });
 * ```
 */
export function encodeGetAllListingsParams(options: GetAllListingsParams) {
  return encodeAbiParameters(FN_INPUTS, [options.startId, options.endId]);
}

/**
 * Encodes the "getAllListings" function into a Hex string with its parameters.
 * @param options - The options for the getAllListings function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetAllListings } from "thirdweb/extensions/marketplace";
 * const result = encodeGetAllListings({
 *  startId: ...,
 *  endId: ...,
 * });
 * ```
 */
export function encodeGetAllListings(options: GetAllListingsParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetAllListingsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getAllListings function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeGetAllListingsResult } from "thirdweb/extensions/marketplace";
 * const result = decodeGetAllListingsResultResult("...");
 * ```
 */
export function decodeGetAllListingsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAllListings" function on the contract.
 * @param options - The options for the getAllListings function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getAllListings } from "thirdweb/extensions/marketplace";
 *
 * const result = await getAllListings({
 *  contract,
 *  startId: ...,
 *  endId: ...,
 * });
 *
 * ```
 */
export async function getAllListings(
  options: BaseTransactionOptions<GetAllListingsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.startId, options.endId],
  });
}
