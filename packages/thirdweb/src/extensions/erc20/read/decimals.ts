import type { ThirdwebContract } from "../../../contract/index.js";
import { readContract } from "../../../transaction/actions/read.js";
import type { TxOpts } from "../../../transaction/transaction.js";
import { detectMethod } from "../../../utils/extensions/detect.js";

const cache = new WeakMap<ThirdwebContract<any>, Promise<number>>();

const METHOD = "function decimals() view returns (uint8)" as const;

/**
 * Detects if the contract has a function to retrieve the number of decimals.
 * @param contract The ThirdwebContract instance representing the contract.
 * @returns A Promise that resolves to a boolean indicating whether the contract has a decimals function.
 * @example
 * ```ts
 * import { detectDecimals } from "thirdweb/extensions/erc20";
 * const supports = await detectDecimals(contract);
 * ```
 */
export async function detectDecimals(
  contract: ThirdwebContract,
): Promise<boolean> {
  return detectMethod({
    contract,
    method: METHOD,
  });
}

/**
 * Retrieves the number of decimal places for an ERC20 token.
 * @param options - The transaction options.
 * @returns A promise that resolves to the number of decimal places (uint8).
 * @extension ERC20
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
    method: METHOD,
  });
  cache.set(options.contract, prom);
  return prom;
}
