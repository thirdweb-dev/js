import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "verify" function.
 */
export type VerifyParams = {
  req: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "req";
    components: [
      { type: "uint128"; name: "validityStartTimestamp" },
      { type: "uint128"; name: "validityEndTimestamp" },
      { type: "bytes32"; name: "uid" },
      { type: "bytes"; name: "data" },
    ];
  }>;
  signature: AbiParameterToPrimitiveType<{ type: "bytes"; name: "signature" }>;
};

export const FN_SELECTOR = "0xc4376dd7" as const;
const FN_INPUTS = [
  {
    components: [
      {
        name: "validityStartTimestamp",
        type: "uint128",
      },
      {
        name: "validityEndTimestamp",
        type: "uint128",
      },
      {
        name: "uid",
        type: "bytes32",
      },
      {
        name: "data",
        type: "bytes",
      },
    ],
    name: "req",
    type: "tuple",
  },
  {
    name: "signature",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "success",
    type: "bool",
  },
  {
    name: "signer",
    type: "address",
  },
] as const;

/**
 * Checks if the `verify` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `verify` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isVerifySupported } from "thirdweb/extensions/thirdweb";
 * const supported = isVerifySupported(["0x..."]);
 * ```
 */
export function isVerifySupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "verify" function.
 * @param options - The options for the verify function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeVerifyParams } from "thirdweb/extensions/thirdweb";
 * const result = encodeVerifyParams({
 *  req: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeVerifyParams(options: VerifyParams) {
  return encodeAbiParameters(FN_INPUTS, [options.req, options.signature]);
}

/**
 * Encodes the "verify" function into a Hex string with its parameters.
 * @param options - The options for the verify function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeVerify } from "thirdweb/extensions/thirdweb";
 * const result = encodeVerify({
 *  req: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeVerify(options: VerifyParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeVerifyParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the verify function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeVerifyResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeVerifyResultResult("...");
 * ```
 */
export function decodeVerifyResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "verify" function on the contract.
 * @param options - The options for the verify function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { verify } from "thirdweb/extensions/thirdweb";
 *
 * const result = await verify({
 *  contract,
 *  req: ...,
 *  signature: ...,
 * });
 *
 * ```
 */
export async function verify(options: BaseTransactionOptions<VerifyParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.req, options.signature],
  });
}
