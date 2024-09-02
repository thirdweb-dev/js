import { selectorsFromBytecode } from "@shazow/whatsabi";
import type { ThirdwebContract } from "thirdweb";
import { resolveImplementation } from "thirdweb/utils";

const SelectorCache = new WeakMap<ThirdwebContract, string[]>();

/**
 * Retrieves the function selectors for a given contract.
 *
 * @param contract - The ThirdwebContract instance.
 * @returns A promise that resolves to an array of function selectors.
 */
export async function resolveFunctionSelectors(
  contract: ThirdwebContract,
): Promise<string[]> {
  // Check cache first
  if (SelectorCache.has(contract)) {
    return SelectorCache.get(contract) || [];
  }
  // immediately return a promise so subsequent calls can await it
  return (async () => {
    // Fetch bytecode for the implementation
    const { bytecode } = await resolveImplementation(contract);

    // Parse selectors
    const selectors = selectorsFromBytecode(bytecode);
    // Cache and return
    SelectorCache.set(contract, selectors);
    return selectors;
  })();
}
