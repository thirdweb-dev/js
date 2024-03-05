import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "verifySignerPermissionRequest" function.
 */
export type VerifySignerPermissionRequestParams = {
  req: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "address"; name: "signer"; type: "address" },
      { internalType: "uint8"; name: "isAdmin"; type: "uint8" },
      { internalType: "address[]"; name: "approvedTargets"; type: "address[]" },
      {
        internalType: "uint256";
        name: "nativeTokenLimitPerTransaction";
        type: "uint256";
      },
      {
        internalType: "uint128";
        name: "permissionStartTimestamp";
        type: "uint128";
      },
      {
        internalType: "uint128";
        name: "permissionEndTimestamp";
        type: "uint128";
      },
      {
        internalType: "uint128";
        name: "reqValidityStartTimestamp";
        type: "uint128";
      },
      {
        internalType: "uint128";
        name: "reqValidityEndTimestamp";
        type: "uint128";
      },
      { internalType: "bytes32"; name: "uid"; type: "bytes32" },
    ];
    internalType: "struct IAccountPermissions.SignerPermissionRequest";
    name: "req";
    type: "tuple";
  }>;
  signature: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "signature";
    type: "bytes";
  }>;
};

/**
 * Calls the verifySignerPermissionRequest function on the contract.
 * @param options - The options for the verifySignerPermissionRequest function.
 * @returns The parsed result of the function call.
 * @extension IACCOUNTPERMISSIONS
 * @example
 * ```
 * import { verifySignerPermissionRequest } from "thirdweb/extensions/IAccountPermissions";
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
    method: [
      "0xa9082d84",
      [
        {
          components: [
            {
              internalType: "address",
              name: "signer",
              type: "address",
            },
            {
              internalType: "uint8",
              name: "isAdmin",
              type: "uint8",
            },
            {
              internalType: "address[]",
              name: "approvedTargets",
              type: "address[]",
            },
            {
              internalType: "uint256",
              name: "nativeTokenLimitPerTransaction",
              type: "uint256",
            },
            {
              internalType: "uint128",
              name: "permissionStartTimestamp",
              type: "uint128",
            },
            {
              internalType: "uint128",
              name: "permissionEndTimestamp",
              type: "uint128",
            },
            {
              internalType: "uint128",
              name: "reqValidityStartTimestamp",
              type: "uint128",
            },
            {
              internalType: "uint128",
              name: "reqValidityEndTimestamp",
              type: "uint128",
            },
            {
              internalType: "bytes32",
              name: "uid",
              type: "bytes32",
            },
          ],
          internalType: "struct IAccountPermissions.SignerPermissionRequest",
          name: "req",
          type: "tuple",
        },
        {
          internalType: "bytes",
          name: "signature",
          type: "bytes",
        },
      ],
      [
        {
          internalType: "bool",
          name: "success",
          type: "bool",
        },
        {
          internalType: "address",
          name: "signer",
          type: "address",
        },
      ],
    ],
    params: [options.req, options.signature],
  });
}
