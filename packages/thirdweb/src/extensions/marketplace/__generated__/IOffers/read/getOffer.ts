import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getOffer" function.
 */
export type GetOfferParams = {
  offerId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_offerId" }>;
};

export const FN_SELECTOR = "0x4579268a" as const;
const FN_INPUTS = [
  {
    name: "_offerId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "offerId",
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
        name: "totalPrice",
        type: "uint256",
      },
      {
        name: "expirationTimestamp",
        type: "uint256",
      },
      {
        name: "offeror",
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
    name: "offer",
    type: "tuple",
  },
] as const;

/**
 * Checks if the `getOffer` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getOffer` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isGetOfferSupported } from "thirdweb/extensions/marketplace";
 * const supported = isGetOfferSupported(["0x..."]);
 * ```
 */
export function isGetOfferSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getOffer" function.
 * @param options - The options for the getOffer function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetOfferParams } from "thirdweb/extensions/marketplace";
 * const result = encodeGetOfferParams({
 *  offerId: ...,
 * });
 * ```
 */
export function encodeGetOfferParams(options: GetOfferParams) {
  return encodeAbiParameters(FN_INPUTS, [options.offerId]);
}

/**
 * Encodes the "getOffer" function into a Hex string with its parameters.
 * @param options - The options for the getOffer function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetOffer } from "thirdweb/extensions/marketplace";
 * const result = encodeGetOffer({
 *  offerId: ...,
 * });
 * ```
 */
export function encodeGetOffer(options: GetOfferParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetOfferParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getOffer function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeGetOfferResult } from "thirdweb/extensions/marketplace";
 * const result = decodeGetOfferResultResult("...");
 * ```
 */
export function decodeGetOfferResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getOffer" function on the contract.
 * @param options - The options for the getOffer function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getOffer } from "thirdweb/extensions/marketplace";
 *
 * const result = await getOffer({
 *  contract,
 *  offerId: ...,
 * });
 *
 * ```
 */
export async function getOffer(
  options: BaseTransactionOptions<GetOfferParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.offerId],
  });
}
