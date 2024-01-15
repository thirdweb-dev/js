import type { Abi } from "abitype";
import type { ThirdwebContract } from "../contract/index.js";

const ABI_CACHE = /*#__PURE__*/ new Map<string, Promise<Abi>>();

export async function resolveAbi(input: ThirdwebContract): Promise<Abi> {
  const { address, chainId } = input;
  const key = `${chainId}:${address}`;
  console.log("[resolving abi]: ", key);
  if (ABI_CACHE.has(key)) {
    return (await ABI_CACHE.get(key)) as Abi;
  }
  const abi = fetchAbi(input);
  ABI_CACHE.set(key, abi);
  return await abi;
}

const CONTRACT_RESOLVER_BASE_URL = "https://contract.thirdweb.com/metadata";

// TODO obviously this has to be a lot more robust
async function fetchAbi(input: ThirdwebContract): Promise<Abi> {
  const response = await fetch(
    `${CONTRACT_RESOLVER_BASE_URL}/${input.chainId}/${input.address}`,
  );
  const json = await response.json();
  // abi is in json.output.abi
  return json.output.abi as Abi;
}
