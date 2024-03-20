import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0x094ec830",
  [],
  [
    {
      type: "string",
    },
  ],
] as const;

/**
 * Calls the "appURI" function on the contract.
 * @param options - The options for the appURI function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```
 * import { appURI } from "thirdweb/extensions/thirdweb";
 *
 * const result = await appURI();
 *
 * ```
 */
export async function appURI(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
