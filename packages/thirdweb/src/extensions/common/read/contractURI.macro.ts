import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";

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
    method: $run$(() =>
      prepareMethod("function contractURI() returns (string)"),
    ),
  });
}
