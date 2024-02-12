import { readContract } from "../../../transaction/actions/read.js";
import type { TxOpts } from "../../../transaction/transaction.js";

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
export function contractURI(options: TxOpts): Promise<string> {
  return readContract({
    ...options,
    method: "function contractURI() returns (string)",
    params: [],
  });
}
