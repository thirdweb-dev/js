import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "idOf" function.
 */
export type IdOfParams = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
};

export const FN_SELECTOR = "0xd94fe832" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "owner",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "fid",
  },
] as const;

/**
 * Checks if the `idOf` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `idOf` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isIdOfSupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = await isIdOfSupported(contract);
 * ```
 */
export async function isIdOfSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "idOf" function.
 * @param options - The options for the idOf function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeIdOfParams } "thirdweb/extensions/farcaster";
 * const result = encodeIdOfParams({
 *  owner: ...,
 * });
 * ```
 */
export function encodeIdOfParams(options: IdOfParams) {
  return encodeAbiParameters(FN_INPUTS, [options.owner]);
}

/**
 * Encodes the "idOf" function into a Hex string with its parameters.
 * @param options - The options for the idOf function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeIdOf } "thirdweb/extensions/farcaster";
 * const result = encodeIdOf({
 *  owner: ...,
 * });
 * ```
 */
export function encodeIdOf(options: IdOfParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIdOfParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the idOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeIdOfResult } from "thirdweb/extensions/farcaster";
 * const result = decodeIdOfResult("...");
 * ```
 */
export function decodeIdOfResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "idOf" function on the contract.
 * @param options - The options for the idOf function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { idOf } from "thirdweb/extensions/farcaster";
 *
 * const result = await idOf({
 *  contract,
 *  owner: ...,
 * });
 *
 * ```
 */
export async function idOf(options: BaseTransactionOptions<IdOfParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.owner],
  });
}
