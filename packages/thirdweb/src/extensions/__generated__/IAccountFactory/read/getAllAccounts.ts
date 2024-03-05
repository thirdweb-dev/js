import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

/**
 * Calls the getAllAccounts function on the contract.
 * @param options - The options for the getAllAccounts function.
 * @returns The parsed result of the function call.
 * @extension IACCOUNTFACTORY
 * @example
 * ```
 * import { getAllAccounts } from "thirdweb/extensions/IAccountFactory";
 *
 * const result = await getAllAccounts();
 *
 * ```
 */
export async function getAllAccounts(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x08e93d0a",
      [],
      [
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
        },
      ],
    ],
    params: [],
  });
}
