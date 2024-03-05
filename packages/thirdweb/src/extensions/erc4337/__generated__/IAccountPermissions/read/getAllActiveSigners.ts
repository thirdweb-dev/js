import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "getAllActiveSigners" function on the contract.
 * @param options - The options for the getAllActiveSigners function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```
 * import { getAllActiveSigners } from "thirdweb/extensions/erc4337";
 *
 * const result = await getAllActiveSigners();
 *
 * ```
 */
export async function getAllActiveSigners(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x8b52d723",
      [],
      [
        {
          type: "tuple[]",
          name: "signers",
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
    params: [],
  });
}
