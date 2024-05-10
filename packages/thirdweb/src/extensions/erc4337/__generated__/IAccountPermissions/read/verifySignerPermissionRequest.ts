import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

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
 * Checks if the `verifySignerPermissionRequest` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `verifySignerPermissionRequest` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isVerifySignerPermissionRequestSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isVerifySignerPermissionRequestSupported(contract);
 * ```
 */
export async function isVerifySignerPermissionRequestSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

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
 * Encodes the "verifySignerPermissionRequest" function into a Hex string with its parameters.
 * @param options - The options for the verifySignerPermissionRequest function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeVerifySignerPermissionRequest } "thirdweb/extensions/erc4337";
 * const result = encodeVerifySignerPermissionRequest({
 *  req: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeVerifySignerPermissionRequest(
  options: VerifySignerPermissionRequestParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeVerifySignerPermissionRequestParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
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
 *  contract,
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
