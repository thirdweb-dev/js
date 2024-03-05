import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "getRulesEngineOverride" function on the contract.
 * @param options - The options for the getRulesEngineOverride function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```
 * import { getRulesEngineOverride } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getRulesEngineOverride();
 *
 * ```
 */
export async function getRulesEngineOverride(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xa7145eb4",
      [],
      [
        {
          internalType: "address",
          name: "rulesEngineAddress",
          type: "address",
        },
      ],
    ],
    params: [],
  });
}
