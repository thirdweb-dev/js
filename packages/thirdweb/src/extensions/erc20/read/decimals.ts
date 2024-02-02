import { type TxOpts } from "~thirdweb/transaction/transaction.js";
import { readContract } from "~thirdweb/transaction/actions/read.js";
import type { ThirdwebContract } from "~thirdweb/contract/index.js";

const cache = new WeakMap<ThirdwebContract<any>, Promise<number>>();

/**
 * Retrieves the number of decimal places for an ERC20 token.
 * @param options - The transaction options.
 * @returns A promise that resolves to the number of decimal places (uint8).
 * @example
 * ```ts
 * import { decimals } from "thirdweb/extensions/erc20";
 * const decimals = await decimals({ contract });
 * ```
 */
export function decimals(options: TxOpts): Promise<number> {
  // "decimals" cannot change so we can cache this result for the lifetime of the contract
  if (cache.has(options.contract)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return cache.get(options.contract)!;
  }
  const prom = readContract({
    ...options,
    method: "function decimals() view returns (uint8)",
  });
  cache.set(options.contract, prom);
  return prom;
}
