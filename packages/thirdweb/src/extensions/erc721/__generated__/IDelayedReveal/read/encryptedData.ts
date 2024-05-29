import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "encryptedData" function.
 */
export type EncryptedDataParams = {
  index: AbiParameterToPrimitiveType<{ type: "uint256"; name: "index" }>;
};

export const FN_SELECTOR = "0xa05112fc" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "index",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes",
  },
] as const;

/**
 * Checks if the `encryptedData` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `encryptedData` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isEncryptedDataSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = await isEncryptedDataSupported(contract);
 * ```
 */
export async function isEncryptedDataSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "encryptedData" function.
 * @param options - The options for the encryptedData function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeEncryptedDataParams } "thirdweb/extensions/erc721";
 * const result = encodeEncryptedDataParams({
 *  index: ...,
 * });
 * ```
 */
export function encodeEncryptedDataParams(options: EncryptedDataParams) {
  return encodeAbiParameters(FN_INPUTS, [options.index]);
}

/**
 * Encodes the "encryptedData" function into a Hex string with its parameters.
 * @param options - The options for the encryptedData function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeEncryptedData } "thirdweb/extensions/erc721";
 * const result = encodeEncryptedData({
 *  index: ...,
 * });
 * ```
 */
export function encodeEncryptedData(options: EncryptedDataParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeEncryptedDataParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the encryptedData function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeEncryptedDataResult } from "thirdweb/extensions/erc721";
 * const result = decodeEncryptedDataResult("...");
 * ```
 */
export function decodeEncryptedDataResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "encryptedData" function on the contract.
 * @param options - The options for the encryptedData function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { encryptedData } from "thirdweb/extensions/erc721";
 *
 * const result = await encryptedData({
 *  contract,
 *  index: ...,
 * });
 *
 * ```
 */
export async function encryptedData(
  options: BaseTransactionOptions<EncryptedDataParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.index],
  });
}
