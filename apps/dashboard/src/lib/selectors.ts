import type { Abi } from "abitype";
import type { ThirdwebContract } from "thirdweb";
import { resolveContractAbi } from "thirdweb/contract";
import { resolveImplementation, toFunctionSelector } from "thirdweb/utils";

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
    const abi = await resolveContractAbi<Abi>(contract).catch(() => null);

    // Parse selectors
    let selectors: string[] = [];
    // prefer ABI if available
    if (abi) {
      selectors = abi
        .filter((f) => f.type === "function")
        .map((f) => toFunctionSelector(f));
    } else {
      // fallback to bytecode via whatsabi
      const [{ selectorsFromBytecode }, { bytecode }] = await Promise.all([
        import("@shazow/whatsabi"),
        resolveImplementation(contract),
      ]);
      selectors = selectorsFromBytecode(bytecode);
    }

    // Cache and return
    SelectorCache.set(contract, selectors);
    return selectors;
  })();
}
