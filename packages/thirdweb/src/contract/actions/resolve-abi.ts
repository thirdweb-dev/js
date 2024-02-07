import { type Abi } from "abitype";
import type { ThirdwebContract } from "../index.js";
import { getChainIdFromChain } from "../../chain/index.js";
import { getClientFetch } from "../../utils/fetch.js";

const CONTRACT_RESOLVER_BASE_URL = "https://contract.thirdweb.com/abi";

const ABI_RESOLUTION_CACHE = new WeakMap<ThirdwebContract<Abi>, Promise<Abi>>();

/**
 * Resolves the ABI (Application Binary Interface) for a given contract.
 * If the contract already has a user-defined ABI, it will be returned.
 * Otherwise, it will attempt to fetch the ABI from a remote source.
 * @param contract - The contract for which to resolve the ABI.
 * @returns A promise that resolves to the ABI of the contract.
 * @example
 * ```ts
 * import { createClient, contract } from "thirdweb";
 * import { resolveAbi } from "thirdweb/contract"
 * const client = createClient({ clientId: "..." });
 * const myContract = contract({
 *  client,
 *  address: "...",
 * });
 * const abi = await resolveAbi(myContract);
 * ```
 */
export function resolveContractAbi<abi extends Abi>(
  contract: ThirdwebContract<abi>,
): Promise<abi> {
  if (ABI_RESOLUTION_CACHE.has(contract)) {
    return ABI_RESOLUTION_CACHE.get(contract) as Promise<abi>;
  }

  const prom = (async () => {
    // if the contract already HAS a user defined we always use that!
    if (contract.abi) {
      return contract.abi as abi;
    }
    // if the method starts with the string `function ` we always will want to try to parse it
    const chainId = getChainIdFromChain(contract.chain);

    // TODO obviously this has to be a lot more robust
    const response = await getClientFetch(contract.client)(
      `${CONTRACT_RESOLVER_BASE_URL}/${chainId}/${contract.address}`,
    );
    const json = await response.json();
    // abi is in json.output.abi

    return json as abi;
  })();
  ABI_RESOLUTION_CACHE.set(contract, prom);
  return prom;
}
