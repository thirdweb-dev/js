import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

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
    name: "listings",
    components: [
      {
        type: "uint256",
        name: "listingId",
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
        name: "pricePerToken",
      },
      {
        type: "uint128",
        name: "startTimestamp",
      },
      {
        type: "uint128",
        name: "endTimestamp",
      },
      {
        type: "address",
        name: "listingCreator",
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
      {
        type: "bool",
        name: "reserved",
      },
    ],
  },
] as const;

/**
 * Checks if the `getAllListings` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getAllListings` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isGetAllListingsSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = await isGetAllListingsSupported(contract);
 * ```
 */
export async function isGetAllListingsSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
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
 * import { encodeGetAllListingsParams } "thirdweb/extensions/marketplace";
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
 * import { encodeGetAllListings } "thirdweb/extensions/marketplace";
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
 * const result = decodeGetAllListingsResult("...");
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
