import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setPermissionsForSigner" function.
 */
export type SetPermissionsForSignerParams = {
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
 * Calls the "setPermissionsForSigner" function on the contract.
 * @param options - The options for the "setPermissionsForSigner" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { setPermissionsForSigner } from "thirdweb/extensions/erc4337";
 *
 * const transaction = setPermissionsForSigner({
 *  req: ...,
 *  signature: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setPermissionsForSigner(
  options: BaseTransactionOptions<SetPermissionsForSignerParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x5892e236",
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
      [],
    ],
    params: [options.req, options.signature],
  });
}
