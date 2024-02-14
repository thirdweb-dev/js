import type { ThirdwebContract } from "../../../contract/index.js";
import {
  readContract,
  type BaseTransactionOptions,
} from "../../../transaction/index.js";

const cache = new WeakMap<ThirdwebContract<any>, Promise<string>>();

/**
 * Retrieves the name of a contract.
 * @param options - The transaction options.
 * @returns A promise that resolves to the name of the contract.
 * @extension
 * @example
 * ```ts
 * import { name } from "thirdweb/extensions/common";
 * const name = await name({ contract });
 * ```
 */
export function name(options: BaseTransactionOptions): Promise<string> {
  // "name" cannot change so we can cache this result for the lifetime of the contract
  if (cache.has(options.contract)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return cache.get(options.contract)!;
  }
  const prom = readContract({
    ...options,
    method: "function name() view returns (string)",
  });
  cache.set(options.contract, prom);
  return prom;
}
