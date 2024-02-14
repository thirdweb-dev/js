import {
  readContract,
  type BaseTransactionOptions,
} from "../../../transaction/index.js";

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
    method: "function contractURI() returns (string)",
    params: [],
  });
}
