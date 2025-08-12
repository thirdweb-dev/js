import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "pubkey" function.
 */
export type PubkeyParams = {
  name: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "name" }>;
};

export const FN_SELECTOR = "0xc8690233" as const;
const FN_INPUTS = [
  {
    name: "name",
    type: "bytes32",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "x",
    type: "bytes32",
  },
  {
    name: "y",
    type: "bytes32",
  },
] as const;

/**
 * Checks if the `pubkey` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `pubkey` method is supported.
 * @extension ENS
 * @example
 * ```ts
 * import { isPubkeySupported } from "thirdweb/extensions/ens";
 * const supported = isPubkeySupported(["0x..."]);
 * ```
 */
export function isPubkeySupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "pubkey" function.
 * @param options - The options for the pubkey function.
 * @returns The encoded ABI parameters.
 * @extension ENS
 * @example
 * ```ts
 * import { encodePubkeyParams } from "thirdweb/extensions/ens";
 * const result = encodePubkeyParams({
 *  name: ...,
 * });
 * ```
 */
export function encodePubkeyParams(options: PubkeyParams) {
  return encodeAbiParameters(FN_INPUTS, [options.name]);
}

/**
 * Encodes the "pubkey" function into a Hex string with its parameters.
 * @param options - The options for the pubkey function.
 * @returns The encoded hexadecimal string.
 * @extension ENS
 * @example
 * ```ts
 * import { encodePubkey } from "thirdweb/extensions/ens";
 * const result = encodePubkey({
 *  name: ...,
 * });
 * ```
 */
export function encodePubkey(options: PubkeyParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodePubkeyParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the pubkey function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ENS
 * @example
 * ```ts
 * import { decodePubkeyResult } from "thirdweb/extensions/ens";
 * const result = decodePubkeyResultResult("...");
 * ```
 */
export function decodePubkeyResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "pubkey" function on the contract.
 * @param options - The options for the pubkey function.
 * @returns The parsed result of the function call.
 * @extension ENS
 * @example
 * ```ts
 * import { pubkey } from "thirdweb/extensions/ens";
 *
 * const result = await pubkey({
 *  contract,
 *  name: ...,
 * });
 *
 * ```
 */
export async function pubkey(options: BaseTransactionOptions<PubkeyParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.name],
  });
}
