import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

/**
 * Calls the accountImplementation function on the contract.
 * @param options - The options for the accountImplementation function.
 * @returns The parsed result of the function call.
 * @extension IACCOUNTFACTORY
 * @example
 * ```
 * import { accountImplementation } from "thirdweb/extensions/IAccountFactory";
 *
 * const result = await accountImplementation();
 *
 * ```
 */
export async function accountImplementation(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x11464fbe",
      [],
      [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
    ],
    params: [],
  });
}
