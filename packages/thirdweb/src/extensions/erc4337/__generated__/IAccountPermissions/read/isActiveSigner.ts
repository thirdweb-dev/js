import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isActiveSigner" function.
 */
export type IsActiveSignerParams = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
};

export const FN_SELECTOR = "0x7dff5a79" as const;
const FN_INPUTS = [
  {
    name: "signer",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `isActiveSigner` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isActiveSigner` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isIsActiveSignerSupported } from "thirdweb/extensions/erc4337";
 * const supported = isIsActiveSignerSupported(["0x..."]);
 * ```
 */
export function isIsActiveSignerSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isActiveSigner" function.
 * @param options - The options for the isActiveSigner function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeIsActiveSignerParams } from "thirdweb/extensions/erc4337";
 * const result = encodeIsActiveSignerParams({
 *  signer: ...,
 * });
 * ```
 */
export function encodeIsActiveSignerParams(options: IsActiveSignerParams) {
  return encodeAbiParameters(FN_INPUTS, [options.signer]);
}

/**
 * Encodes the "isActiveSigner" function into a Hex string with its parameters.
 * @param options - The options for the isActiveSigner function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeIsActiveSigner } from "thirdweb/extensions/erc4337";
 * const result = encodeIsActiveSigner({
 *  signer: ...,
 * });
 * ```
 */
export function encodeIsActiveSigner(options: IsActiveSignerParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsActiveSignerParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isActiveSigner function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4337
 * @example
 * ```ts
 * import { decodeIsActiveSignerResult } from "thirdweb/extensions/erc4337";
 * const result = decodeIsActiveSignerResultResult("...");
 * ```
 */
export function decodeIsActiveSignerResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isActiveSigner" function on the contract.
 * @param options - The options for the isActiveSigner function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isActiveSigner } from "thirdweb/extensions/erc4337";
 *
 * const result = await isActiveSigner({
 *  contract,
 *  signer: ...,
 * });
 *
 * ```
 */
export async function isActiveSigner(
  options: BaseTransactionOptions<IsActiveSignerParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.signer],
  });
}
