import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0xe8a3d485",
  [],
  [
    {
      type: "string",
    },
  ],
] as const;

/**
 * Calls the "contractURI" function on the contract.
 * @param options - The options for the contractURI function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```
 * import { contractURI } from "thirdweb/extensions/thirdweb";
 *
 * const result = await contractURI();
 *
 * ```
 */
export async function contractURI(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
