import { type Abi } from "abitype";

import type { ThirdwebContract } from "../index.js";

const CONTRACT_RESOLVER_BASE_URL = "https://contract.thirdweb.com/metadata";

const ABI_RESOLUTION_CACHE = new WeakMap<ThirdwebContract<Abi>, Promise<Abi>>();

export function resolveContractAbi<abi extends Abi>(
  contract: ThirdwebContract<abi>,
): Promise<abi> {
  console.log("[resolveContractAbi] - entry", contract);
  if (ABI_RESOLUTION_CACHE.has(contract)) {
    console.log("[resolveContractAbi] - cache hit");
    return ABI_RESOLUTION_CACHE.get(contract) as Promise<abi>;
  }
  console.log("[resolveContractAbi] - no cache");
  const prom = (async () => {
    console.log("[resolveContractAbi] - fetching");
    // if the contract already HAS a user defined we always use that!
    if (contract.abi) {
      return contract.abi as abi;
    }
    // if the method starts with the string `function ` we always will want to try to parse it

    // TODO obviously this has to be a lot more robust
    const response = await fetch(
      `${CONTRACT_RESOLVER_BASE_URL}/${contract.chainId}/${contract.address}`,
    );
    const json = await response.json();
    // abi is in json.output.abi
    console.log("[resolveContractAbi] - resolved");
    return json.output.abi as abi;
  })();
  ABI_RESOLUTION_CACHE.set(contract, prom);
  return prom;
}
