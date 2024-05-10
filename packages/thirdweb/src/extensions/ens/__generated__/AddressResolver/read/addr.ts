import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "addr" function.
 */
export type AddrParams = {
  name: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "name" }>;
};

export const FN_SELECTOR = "0x3b3b57de" as const;
const FN_INPUTS = [
  {
    type: "bytes32",
    name: "name",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `addr` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `addr` method is supported.
 * @extension ENS
 * @example
 * ```ts
 * import { isAddrSupported } from "thirdweb/extensions/ens";
 *
 * const supported = await isAddrSupported(contract);
 * ```
 */
export async function isAddrSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "addr" function.
 * @param options - The options for the addr function.
 * @returns The encoded ABI parameters.
 * @extension ENS
 * @example
 * ```ts
 * import { encodeAddrParams } "thirdweb/extensions/ens";
 * const result = encodeAddrParams({
 *  name: ...,
 * });
 * ```
 */
export function encodeAddrParams(options: AddrParams) {
  return encodeAbiParameters(FN_INPUTS, [options.name]);
}

/**
 * Encodes the "addr" function into a Hex string with its parameters.
 * @param options - The options for the addr function.
 * @returns The encoded hexadecimal string.
 * @extension ENS
 * @example
 * ```ts
 * import { encodeAddr } "thirdweb/extensions/ens";
 * const result = encodeAddr({
 *  name: ...,
 * });
 * ```
 */
export function encodeAddr(options: AddrParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeAddrParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the addr function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ENS
 * @example
 * ```ts
 * import { decodeAddrResult } from "thirdweb/extensions/ens";
 * const result = decodeAddrResult("...");
 * ```
 */
export function decodeAddrResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "addr" function on the contract.
 * @param options - The options for the addr function.
 * @returns The parsed result of the function call.
 * @extension ENS
 * @example
 * ```ts
 * import { addr } from "thirdweb/extensions/ens";
 *
 * const result = await addr({
 *  contract,
 *  name: ...,
 * });
 *
 * ```
 */
export async function addr(options: BaseTransactionOptions<AddrParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.name],
  });
}
