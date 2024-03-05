import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

/**
 * Calls the factory function on the contract.
 * @param options - The options for the factory function.
 * @returns The parsed result of the function call.
 * @extension IACCOUNTCORE
 * @example
 * ```
 * import { factory } from "thirdweb/extensions/IAccountCore";
 *
 * const result = await factory();
 *
 * ```
 */
export async function factory(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xc45a0155",
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
