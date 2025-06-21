import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "verifyFidSignature" function.
 */
export type VerifyFidSignatureParams = {
  custodyAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "custodyAddress";
  }>;
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
  digest: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "digest" }>;
  sig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "sig" }>;
};

export const FN_SELECTOR = "0x32faac70" as const;
const FN_INPUTS = [
  {
    name: "custodyAddress",
    type: "address",
  },
  {
    name: "fid",
    type: "uint256",
  },
  {
    name: "digest",
    type: "bytes32",
  },
  {
    name: "sig",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "isValid",
    type: "bool",
  },
] as const;

/**
 * Checks if the `verifyFidSignature` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `verifyFidSignature` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isVerifyFidSignatureSupported } from "thirdweb/extensions/farcaster";
 * const supported = isVerifyFidSignatureSupported(["0x..."]);
 * ```
 */
export function isVerifyFidSignatureSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "verifyFidSignature" function.
 * @param options - The options for the verifyFidSignature function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeVerifyFidSignatureParams } from "thirdweb/extensions/farcaster";
 * const result = encodeVerifyFidSignatureParams({
 *  custodyAddress: ...,
 *  fid: ...,
 *  digest: ...,
 *  sig: ...,
 * });
 * ```
 */
export function encodeVerifyFidSignatureParams(
  options: VerifyFidSignatureParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.custodyAddress,
    options.fid,
    options.digest,
    options.sig,
  ]);
}

/**
 * Encodes the "verifyFidSignature" function into a Hex string with its parameters.
 * @param options - The options for the verifyFidSignature function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeVerifyFidSignature } from "thirdweb/extensions/farcaster";
 * const result = encodeVerifyFidSignature({
 *  custodyAddress: ...,
 *  fid: ...,
 *  digest: ...,
 *  sig: ...,
 * });
 * ```
 */
export function encodeVerifyFidSignature(options: VerifyFidSignatureParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeVerifyFidSignatureParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the verifyFidSignature function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeVerifyFidSignatureResult } from "thirdweb/extensions/farcaster";
 * const result = decodeVerifyFidSignatureResultResult("...");
 * ```
 */
export function decodeVerifyFidSignatureResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "verifyFidSignature" function on the contract.
 * @param options - The options for the verifyFidSignature function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { verifyFidSignature } from "thirdweb/extensions/farcaster";
 *
 * const result = await verifyFidSignature({
 *  contract,
 *  custodyAddress: ...,
 *  fid: ...,
 *  digest: ...,
 *  sig: ...,
 * });
 *
 * ```
 */
export async function verifyFidSignature(
  options: BaseTransactionOptions<VerifyFidSignatureParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.custodyAddress, options.fid, options.digest, options.sig],
  });
}
