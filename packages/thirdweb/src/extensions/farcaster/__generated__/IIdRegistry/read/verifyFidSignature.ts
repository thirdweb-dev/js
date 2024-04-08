import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
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
    type: "address",
    name: "custodyAddress",
  },
  {
    type: "uint256",
    name: "fid",
  },
  {
    type: "bytes32",
    name: "digest",
  },
  {
    type: "bytes",
    name: "sig",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
    name: "isValid",
  },
] as const;

/**
 * Encodes the parameters for the "verifyFidSignature" function.
 * @param options - The options for the verifyFidSignature function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeVerifyFidSignatureParams } "thirdweb/extensions/farcaster";
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
 * Decodes the result of the verifyFidSignature function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeVerifyFidSignatureResult } from "thirdweb/extensions/farcaster";
 * const result = decodeVerifyFidSignatureResult("...");
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
