import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0xe9523c97",
  [],
  [
    {
      type: "address[]",
      name: "admins",
    },
  ],
] as const;

/**
 * Calls the "getAllAdmins" function on the contract.
 * @param options - The options for the getAllAdmins function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```
 * import { getAllAdmins } from "thirdweb/extensions/erc4337";
 *
 * const result = await getAllAdmins();
 *
 * ```
 */
export async function getAllAdmins(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
