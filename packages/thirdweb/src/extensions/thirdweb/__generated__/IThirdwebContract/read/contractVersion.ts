import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0xa0a8e460",
  [],
  [
    {
      type: "uint8",
    },
  ],
] as const;

/**
 * Calls the "contractVersion" function on the contract.
 * @param options - The options for the contractVersion function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```
 * import { contractVersion } from "thirdweb/extensions/thirdweb";
 *
 * const result = await contractVersion();
 *
 * ```
 */
export async function contractVersion(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
