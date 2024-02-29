import type { ThirdwebContract } from "../../../contract/contract.js";
import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * Retrieves the symbol of a contract.
 * @param options - The transaction options.
 * @returns A promise that resolves to the symbol of the contract.
 * @extension
 * @example
 * ```ts
 * import { symbol } from "thirdweb/extensions/common";
 * const symbol = await symbol({ contract });
 * ```
 */
export function symbol(options: BaseTransactionOptions): Promise<string> {
  // "symbol" cannot change so we can cache this result for the lifetime of the contract
  if (cache.has(options.contract)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return cache.get(options.contract)!;
  }
  const prom = readContract({
    ...options,
    method: [
  "0x95d89b41",
  [],
  [
    {
      "type": "string"
    }
  ]
],
  });
  cache.set(options.contract, prom);
  return prom;
}

const cache = new WeakMap<ThirdwebContract<any>, Promise<string>>();
