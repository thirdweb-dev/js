import { type Abi } from "abitype";
import { type ThirdwebContract } from "../index.js";
import { getChainIdFromChain } from "../../chain/index.js";
import { getClientFetch } from "../../utils/fetch.js";
import { getByteCode } from "./get-bytecode.js";
import { extractIPFSUri } from "../../utils/index.js";
import { download } from "../../storage/download.js";

const ABI_RESOLUTION_CACHE = new WeakMap<ThirdwebContract<Abi>, Promise<Abi>>();

/**
 * Resolves the ABI (Application Binary Interface) for a given contract.
 * If the ABI is already cached, it returns the cached value.
 * Otherwise, it tries to resolve the ABI from the contract's API.
 * If that fails, it resolves the ABI from the contract's bytecode.
 * @param contract The contract for which to resolve the ABI.
 * @returns A promise that resolves to the ABI of the contract.
 * @example
 * ```ts
 * import { createClient, getContract } from "thirdweb";
 * import { resolveContractAbi } from "thirdweb/contract"
 * const client = createClient({ clientId: "..." });
 * const myContract = getContract({
 *  client,
 *  address: "...",
 *  chain: 1,
 * });
 * const abi = await resolveContractAbi(myContract);
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
    // try to get it from the api
    try {
      return await resolveAbiFromContractApi(contract);
    } catch (e) {
      // if that fails, try to resolve it from the bytecode
      return await resolveAbiFromBytecode(contract);
    }
  })();
  ABI_RESOLUTION_CACHE.set(contract, prom);
  return prom;
}

/**
 * Resolves the ABI (Application Binary Interface) for a contract from the contract API.
 * @param contract The ThirdwebContract instance representing the contract.
 * @param contractApiBaseUrl The base URL of the contract API. Defaults to "https://contract.thirdweb.com/abi".
 * @returns A promise that resolves to the ABI of the contract.
 * @example
 * ```ts
 * import { createClient, getContract } from "thirdweb";
 * import { resolveAbiFromContractApi } from "thirdweb/contract"
 * const client = createClient({ clientId: "..." });
 * const myContract = getContract({
 *  client,
 *  address: "...",
 *  chain: 1,
 * });
 * const abi = await resolveAbiFromContractApi(myContract);
 * ```
 */
export async function resolveAbiFromContractApi<abi extends Abi>(
  contract: ThirdwebContract<abi>,
  contractApiBaseUrl = "https://contract.thirdweb.com/abi",
) {
  const chainId = getChainIdFromChain(contract.chain);
  const response = await getClientFetch(contract.client)(
    `${contractApiBaseUrl}/${chainId}/${contract.address}`,
  );
  const json = await response.json();
  return json as abi;
}

/**
 * Resolves the ABI (Application Binary Interface) from the bytecode of a contract.
 * @param contract The ThirdwebContract instance.
 * @returns The resolved ABI as a generic type.
 * @throws Error if no IPFS URI is found in the bytecode.
 * @example
 * ```ts
 * import { createClient, getContract } from "thirdweb";
 * import { resolveAbiFromBytecode } from "thirdweb/contract"
 * const client = createClient({ clientId: "..." });
 * const myContract = getContract({
 *  client,
 *  address: "...",
 *  chain: 1,
 * });
 * const abi = await resolveAbiFromBytecode(myContract);
 * ```
 */
export async function resolveAbiFromBytecode<abi extends Abi>(
  contract: ThirdwebContract<abi>,
) {
  const bytecode = await getByteCode(contract);
  const ipfsUri = extractIPFSUri(bytecode);
  if (!ipfsUri) {
    throw new Error("No IPFS URI found in bytecode");
  }
  const res = await download({ uri: ipfsUri, client: contract.client });
  const json = await res.json();
  // ABI is at `json.output.abi`
  return json.output.abi as abi;
}
