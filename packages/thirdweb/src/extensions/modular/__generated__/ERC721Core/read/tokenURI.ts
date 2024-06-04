import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "tokenURI" function.
 */
export type TokenURIParams = {
  id: AbiParameterToPrimitiveType<{
    name: "id";
    type: "uint256";
    internalType: "uint256";
  }>;
};

export const FN_SELECTOR = "0xc87b56dd" as const;
const FN_INPUTS = [
  {
    name: "id",
    type: "uint256",
    internalType: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "string",
    internalType: "string",
  },
] as const;

/**
 * Checks if the `tokenURI` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `tokenURI` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isTokenURISupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isTokenURISupported(contract);
 * ```
 */
export async function isTokenURISupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "tokenURI" function.
 * @param options - The options for the tokenURI function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeTokenURIParams } "thirdweb/extensions/modular";
 * const result = encodeTokenURIParams({
 *  id: ...,
 * });
 * ```
 */
export function encodeTokenURIParams(options: TokenURIParams) {
  return encodeAbiParameters(FN_INPUTS, [options.id]);
}

/**
 * Encodes the "tokenURI" function into a Hex string with its parameters.
 * @param options - The options for the tokenURI function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeTokenURI } "thirdweb/extensions/modular";
 * const result = encodeTokenURI({
 *  id: ...,
 * });
 * ```
 */
export function encodeTokenURI(options: TokenURIParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeTokenURIParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the tokenURI function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeTokenURIResult } from "thirdweb/extensions/modular";
 * const result = decodeTokenURIResult("...");
 * ```
 */
export function decodeTokenURIResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "tokenURI" function on the contract.
 * @param options - The options for the tokenURI function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { tokenURI } from "thirdweb/extensions/modular";
 *
 * const result = await tokenURI({
 *  contract,
 *  id: ...,
 * });
 *
 * ```
 */
export async function tokenURI(
  options: BaseTransactionOptions<TokenURIParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.id],
  });
}
