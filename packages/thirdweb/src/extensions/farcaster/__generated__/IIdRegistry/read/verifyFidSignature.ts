import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

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

/**
 * Calls the "verifyFidSignature" function on the contract.
 * @param options - The options for the verifyFidSignature function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
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
    method: [
      "0x32faac70",
      [
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
      ],
      [
        {
          type: "bool",
          name: "isValid",
        },
      ],
    ],
    params: [options.custodyAddress, options.fid, options.digest, options.sig],
  });
}
