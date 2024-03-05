import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

/**
 * Calls the getAllActiveSigners function on the contract.
 * @param options - The options for the getAllActiveSigners function.
 * @returns The parsed result of the function call.
 * @extension IACCOUNTPERMISSIONS_V1
 * @example
 * ```
 * import { getAllActiveSigners } from "thirdweb/extensions/IAccountPermissions_V1";
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
          internalType: "struct IAccountPermissions_V1.SignerPermissions[]",
          name: "signers",
          type: "tuple[]",
        },
      ],
    ],
    params: [],
  });
}
