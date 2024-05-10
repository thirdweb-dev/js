import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getOffer" function.
 */
export type GetOfferParams = {
  offerId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_offerId" }>;
};

export const FN_SELECTOR = "0x4579268a" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_offerId",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "tuple",
    name: "offer",
    components: [
      {
        type: "uint256",
        name: "offerId",
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
        name: "totalPrice",
      },
      {
        type: "uint256",
        name: "expirationTimestamp",
      },
      {
        type: "address",
        name: "offeror",
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
 * Checks if the `getOffer` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getOffer` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isGetOfferSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = await isGetOfferSupported(contract);
 * ```
 */
export async function isGetOfferSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
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
 * import { encodeGetOfferParams } "thirdweb/extensions/marketplace";
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
 * import { encodeGetOffer } "thirdweb/extensions/marketplace";
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
 * const result = decodeGetOfferResult("...");
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
