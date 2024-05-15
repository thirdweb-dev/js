import { getBytecode } from "../../contract/actions/get-bytecode.js";
import type { ThirdwebContract } from "../../contract/contract.js";

// we use a weak set to cache *if* a contract *is* deployed
// aka: we add it to this set if it's deployed, and only if it is deployed
// instead of using a map with: true only (because we only want to cache if it's deployed)
const cache = new WeakSet<ThirdwebContract>();

/**
 * Checks if a contract is deployed by verifying its bytecode.
 * @param contract - The contract to check.
 * @returns A promise that resolves to a boolean indicating whether the contract is deployed or not.
 * @example
 * ```ts
 * import { getContract } from "thirdweb/contract";
 * import { isContractDeployed } from "thirdweb/contract/utils";
 *
 * const contract = getContract({ ... });
 * const isDeployed = await isContractDeployed(contract);
 * console.log(isDeployed);
 * ```
 * @contract
 */
export async function isContractDeployed(
  contract: ThirdwebContract,
): Promise<boolean> {
  if (cache.has(contract)) {
    // it's only in there if it's deployed
    return true;
  }
  // this already dedupes requests for the same contract
  const bytecode = await getBytecode(contract);
  const isDeployed = bytecode !== "0x";
  // if it's deployed, we add it to the cache
  if (isDeployed) {
    cache.add(contract);
  }
  return isDeployed;
}
