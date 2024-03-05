import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

/**
 * Calls the getAllAdmins function on the contract.
 * @param options - The options for the getAllAdmins function.
 * @returns The parsed result of the function call.
 * @extension IACCOUNTPERMISSIONS_V1
 * @example
 * ```
 * import { getAllAdmins } from "thirdweb/extensions/IAccountPermissions_V1";
 *
 * const result = await getAllAdmins();
 *
 * ```
 */
export async function getAllAdmins(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xe9523c97",
      [],
      [
        {
          internalType: "address[]",
          name: "admins",
          type: "address[]",
        },
      ],
    ],
    params: [],
  });
}
