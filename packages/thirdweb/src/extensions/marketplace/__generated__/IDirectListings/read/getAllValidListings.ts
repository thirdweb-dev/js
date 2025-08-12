import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getAllValidListings" function.
 */
export type GetAllValidListingsParams = {
  startId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_startId" }>;
  endId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_endId" }>;
};

export const FN_SELECTOR = "0x31654b4d" as const;
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
 * Checks if the `getAllValidListings` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getAllValidListings` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isGetAllValidListingsSupported } from "thirdweb/extensions/marketplace";
 * const supported = isGetAllValidListingsSupported(["0x..."]);
 * ```
 */
export function isGetAllValidListingsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getAllValidListings" function.
 * @param options - The options for the getAllValidListings function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetAllValidListingsParams } from "thirdweb/extensions/marketplace";
 * const result = encodeGetAllValidListingsParams({
 *  startId: ...,
 *  endId: ...,
 * });
 * ```
 */
export function encodeGetAllValidListingsParams(
  options: GetAllValidListingsParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.startId, options.endId]);
}

/**
 * Encodes the "getAllValidListings" function into a Hex string with its parameters.
 * @param options - The options for the getAllValidListings function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetAllValidListings } from "thirdweb/extensions/marketplace";
 * const result = encodeGetAllValidListings({
 *  startId: ...,
 *  endId: ...,
 * });
 * ```
 */
export function encodeGetAllValidListings(options: GetAllValidListingsParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetAllValidListingsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getAllValidListings function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeGetAllValidListingsResult } from "thirdweb/extensions/marketplace";
 * const result = decodeGetAllValidListingsResultResult("...");
 * ```
 */
export function decodeGetAllValidListingsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAllValidListings" function on the contract.
 * @param options - The options for the getAllValidListings function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getAllValidListings } from "thirdweb/extensions/marketplace";
 *
 * const result = await getAllValidListings({
 *  contract,
 *  startId: ...,
 *  endId: ...,
 * });
 *
 * ```
 */
export async function getAllValidListings(
  options: BaseTransactionOptions<GetAllValidListingsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.startId, options.endId],
  });
}
