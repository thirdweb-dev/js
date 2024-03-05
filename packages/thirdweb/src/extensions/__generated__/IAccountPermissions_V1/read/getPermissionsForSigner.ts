import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getPermissionsForSigner" function.
 */
export type GetPermissionsForSignerParams = {
  signer: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "signer";
    type: "address";
  }>;
};

/**
 * Calls the getPermissionsForSigner function on the contract.
 * @param options - The options for the getPermissionsForSigner function.
 * @returns The parsed result of the function call.
 * @extension IACCOUNTPERMISSIONS_V1
 * @example
 * ```
 * import { getPermissionsForSigner } from "thirdweb/extensions/IAccountPermissions_V1";
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
    method: [
      "0xf15d424e",
      [
        {
          internalType: "address",
          name: "signer",
          type: "address",
        },
      ],
      [
        {
          components: [
            {
              internalType: "address",
              name: "signer",
              type: "address",
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
              name: "startTimestamp",
              type: "uint128",
            },
            {
              internalType: "uint128",
              name: "endTimestamp",
              type: "uint128",
            },
          ],
          internalType: "struct IAccountPermissions_V1.SignerPermissions",
          name: "permissions",
          type: "tuple",
        },
      ],
    ],
    params: [options.signer],
  });
}
