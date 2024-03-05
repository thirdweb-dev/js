import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "getAllSigners" function on the contract.
 * @param options - The options for the getAllSigners function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```
 * import { getAllSigners } from "thirdweb/extensions/erc4337";
 *
 * const result = await getAllSigners();
 *
 * ```
 */
export async function getAllSigners(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xd42f2f35",
      [],
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
          internalType: "struct IAccountPermissions.SignerPermissions[]",
          name: "signers",
          type: "tuple[]",
        },
      ],
    ],
    params: [],
  });
}
