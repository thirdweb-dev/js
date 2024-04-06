import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getPermissionsForSigner" function.
 */
export type GetPermissionsForSignerParams = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
};

export const FN_SELECTOR = "0xf15d424e" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "signer",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "tuple",
    name: "permissions",
    components: [
      {
        type: "address",
        name: "signer",
      },
      {
        type: "address[]",
        name: "approvedTargets",
      },
      {
        type: "uint256",
        name: "nativeTokenLimitPerTransaction",
      },
      {
        type: "uint128",
        name: "startTimestamp",
      },
      {
        type: "uint128",
        name: "endTimestamp",
      },
    ],
  },
] as const;

/**
 * Encodes the parameters for the "getPermissionsForSigner" function.
 * @param options - The options for the getPermissionsForSigner function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeGetPermissionsForSignerParams } "thirdweb/extensions/erc4337";
 * const result = encodeGetPermissionsForSignerParams({
 *  signer: ...,
 * });
 * ```
 */
export function encodeGetPermissionsForSignerParams(
  options: GetPermissionsForSignerParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.signer]);
}

/**
 * Decodes the result of the getPermissionsForSigner function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4337
 * @example
 * ```ts
 * import { decodeGetPermissionsForSignerResult } from "thirdweb/extensions/erc4337";
 * const result = decodeGetPermissionsForSignerResult("...");
 * ```
 */
export function decodeGetPermissionsForSignerResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getPermissionsForSigner" function on the contract.
 * @param options - The options for the getPermissionsForSigner function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```ts
 * import { getPermissionsForSigner } from "thirdweb/extensions/erc4337";
 *
 * const result = await getPermissionsForSigner({
 *  signer: ...,
 * });
 *
 * ```
 */
export async function getPermissionsForSigner(
  options: BaseTransactionOptions<GetPermissionsForSignerParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.signer],
  });
}
