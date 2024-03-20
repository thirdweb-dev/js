import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

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

const METHOD = [
  "0xa9082d84",
  [
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
  ],
  [
    {
      type: "bool",
      name: "success",
    },
    {
      type: "address",
      name: "signer",
    },
  ],
] as const;

/**
 * Calls the "verifySignerPermissionRequest" function on the contract.
 * @param options - The options for the verifySignerPermissionRequest function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```
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
    method: METHOD,
    params: [options.req, options.signature],
  });
}
