import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";

/**
 * Retrieves the owner of a contract.
 * @param options - The transaction options.
 * @returns A promise that resolves to the owner of the contract.
 * @extension Ownable
 * @example
 * ```ts
 * import { owner } from "thirdweb/extensions/commmon";
 * const owner = await owner({ contract });
 * ```
 */
export function owner(options: BaseTransactionOptions): Promise<string> {
  return readContract({
    ...options,
    method: $run$(() => prepareMethod("function owner() returns (address)")),
  });
}
