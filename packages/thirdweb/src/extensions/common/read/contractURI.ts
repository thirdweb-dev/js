import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * Retrieves the contract URI for a given transaction options.
 * @param options The transaction options.
 * @returns A promise that resolves to the contract URI.
 * @extension
 * @example
 * ```ts
 * import { contractURI } from "thirdweb/extensions/common";
 * const uri = await contractURI({ contract });
 * ```
 */
export function contractURI(options: BaseTransactionOptions): Promise<string> {
  return readContract({
    ...options,
    method: [
  "0xe8a3d485",
  [],
  [
    {
      "type": "string"
    }
  ]
],
  });
}
