import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "setPermissionsForSigner" function.
 */

type SetPermissionsForSignerParamsInternal = {
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

export type SetPermissionsForSignerParams = Prettify<
  | SetPermissionsForSignerParamsInternal
  | {
      asyncParams: () => Promise<SetPermissionsForSignerParamsInternal>;
    }
>;
const METHOD = [
  "0x5892e236",
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
  [],
] as const;

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
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.req, resolvedParams.signature] as const;
          }
        : [options.req, options.signature],
  });
}
