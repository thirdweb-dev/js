import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "verifySignerPermissionRequest" function.
 */
export type VerifySignerPermissionRequestParams = {
  req: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "req";
    components: [
      { type: "address"; name: "signer" },
      { type: "uint8"; name: "isAdmin" },
      { type: "address[]"; name: "approvedTargets" },
      { type: "uint256"; name: "nativeTokenLimitPerTransaction" },
      { type: "uint128"; name: "permissionStartTimestamp" },
      { type: "uint128"; name: "permissionEndTimestamp" },
      { type: "uint128"; name: "reqValidityStartTimestamp" },
      { type: "uint128"; name: "reqValidityEndTimestamp" },
      { type: "bytes32"; name: "uid" },
    ];
  }>;
  signature: AbiParameterToPrimitiveType<{ type: "bytes"; name: "signature" }>;
};

export const FN_SELECTOR = "0xa9082d84" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "req",
    components: [
      {
        type: "address",
        name: "signer",
      },
      {
        type: "uint8",
        name: "isAdmin",
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
        name: "permissionStartTimestamp",
      },
      {
        type: "uint128",
        name: "permissionEndTimestamp",
      },
      {
        type: "uint128",
        name: "reqValidityStartTimestamp",
      },
      {
        type: "uint128",
        name: "reqValidityEndTimestamp",
      },
      {
        type: "bytes32",
        name: "uid",
      },
    ],
  },
  {
    type: "bytes",
    name: "signature",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
    name: "success",
  },
  {
    type: "address",
    name: "signer",
  },
] as const;

/**
 * Encodes the parameters for the "verifySignerPermissionRequest" function.
 * @param options - The options for the verifySignerPermissionRequest function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeVerifySignerPermissionRequestParams } "thirdweb/extensions/erc4337";
 * const result = encodeVerifySignerPermissionRequestParams({
 *  req: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeVerifySignerPermissionRequestParams(
  options: VerifySignerPermissionRequestParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.req, options.signature]);
}

/**
 * Decodes the result of the verifySignerPermissionRequest function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4337
 * @example
 * ```ts
 * import { decodeVerifySignerPermissionRequestResult } from "thirdweb/extensions/erc4337";
 * const result = decodeVerifySignerPermissionRequestResult("...");
 * ```
 */
export function decodeVerifySignerPermissionRequestResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "verifySignerPermissionRequest" function on the contract.
 * @param options - The options for the verifySignerPermissionRequest function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```ts
 * import { verifySignerPermissionRequest } from "thirdweb/extensions/erc4337";
 *
 * const result = await verifySignerPermissionRequest({
 *  req: ...,
 *  signature: ...,
 * });
 *
 * ```
 */
export async function verifySignerPermissionRequest(
  options: BaseTransactionOptions<VerifySignerPermissionRequestParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.req, options.signature],
  });
}
