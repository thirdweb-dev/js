import { ValidContractInstance } from "../../contracts";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

const STORAGE_CACHE = new ThirdwebStorage();
const CONTRACT_CACHE = new Map<string, ValidContractInstance>();

function getContractCacheKey(address: string, chainId: number) {
  return `${address}-${chainId}`;
}

export function inContractCache(address: string, chainId: number): boolean {
  const cacheKey = getContractCacheKey(address, chainId);
  return CONTRACT_CACHE.has(cacheKey);
}

export function getCachedContract(
  address: string,
  chainId: number,
): ValidContractInstance {
  if (!inContractCache(address, chainId)) {
    throw new Error(`Contract ${address} was not found in cache`);
  }

  const cacheKey = getContractCacheKey(address, chainId);
  return CONTRACT_CACHE.get(cacheKey) as ValidContractInstance;
}

export function cacheContract(
  contract: ValidContractInstance,
  address: string,
  chainId: number,
) {
  const cacheKey = getContractCacheKey(address, chainId);
  CONTRACT_CACHE.set(cacheKey, contract);
}

export function getCachedStorage(storage?: ThirdwebStorage): ThirdwebStorage {
  return storage || STORAGE_CACHE;
}
