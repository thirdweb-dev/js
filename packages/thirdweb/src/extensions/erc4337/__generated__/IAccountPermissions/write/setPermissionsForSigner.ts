import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "setPermissionsForSigner" function.
 */

export type SetPermissionsForSignerParams = {
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

export const FN_SELECTOR = "0x5892e236" as const;
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
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setPermissionsForSigner" function.
 * @param options - The options for the setPermissionsForSigner function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeSetPermissionsForSignerParams } "thirdweb/extensions/erc4337";
 * const result = encodeSetPermissionsForSignerParams({
 *  req: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeSetPermissionsForSignerParams(
  options: SetPermissionsForSignerParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.req, options.signature]);
}

/**
 * Calls the "setPermissionsForSigner" function on the contract.
 * @param options - The options for the "setPermissionsForSigner" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { setPermissionsForSigner } from "thirdweb/extensions/erc4337";
 *
 * const transaction = setPermissionsForSigner({
 *  contract,
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
  options: BaseTransactionOptions<
    | SetPermissionsForSignerParams
    | {
        asyncParams: () => Promise<SetPermissionsForSignerParams>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.req, resolvedParams.signature] as const;
          }
        : [options.req, options.signature],
  });
}
