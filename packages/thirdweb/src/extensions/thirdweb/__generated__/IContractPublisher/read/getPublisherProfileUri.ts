import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getPublisherProfileUri" function.
 */
export type GetPublisherProfileUriParams = {
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
  }>;
};

export const FN_SELECTOR = "0x4f781675" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "publisher",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "string",
    name: "uri",
  },
] as const;

/**
 * Encodes the parameters for the "getPublisherProfileUri" function.
 * @param options - The options for the getPublisherProfileUri function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetPublisherProfileUriParams } "thirdweb/extensions/thirdweb";
 * const result = encodeGetPublisherProfileUriParams({
 *  publisher: ...,
 * });
 * ```
 */
export function encodeGetPublisherProfileUriParams(
  options: GetPublisherProfileUriParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.publisher]);
}

/**
 * Decodes the result of the getPublisherProfileUri function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeGetPublisherProfileUriResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeGetPublisherProfileUriResult("...");
 * ```
 */
export function decodeGetPublisherProfileUriResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getPublisherProfileUri" function on the contract.
 * @param options - The options for the getPublisherProfileUri function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getPublisherProfileUri } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getPublisherProfileUri({
 *  publisher: ...,
 * });
 *
 * ```
 */
export async function getPublisherProfileUri(
  options: BaseTransactionOptions<GetPublisherProfileUriParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.publisher],
  });
}
