import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getPermissionsForSigner" function.
 */
export type GetPermissionsForSignerParams = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
};

/**
 * Calls the "getPermissionsForSigner" function on the contract.
 * @param options - The options for the getPermissionsForSigner function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```
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
    method: [
      "0xf15d424e",
      [
        {
          type: "address",
          name: "signer",
        },
      ],
      [
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
      ],
    ],
    params: [options.signer],
  });
}
