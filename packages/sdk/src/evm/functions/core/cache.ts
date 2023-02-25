import { ValidContractInstance } from "../../core/types";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

const CONTRACT_CACHE = new Map<string, ValidContractInstance>();

const STORAGE_CACHE = new Map<"cache", ThirdwebStorage>();
STORAGE_CACHE.set("cache", new ThirdwebStorage());

export function inContractCache(address: string): boolean {
  return CONTRACT_CACHE.has(address);
}

export function getCachedContract(address: string): ValidContractInstance {
  if (!inContractCache(address)) {
    throw new Error(`Contract ${address} was not found in cache`);
  }

  return CONTRACT_CACHE.get(address) as ValidContractInstance;
}

export function cacheContract(
  address: string,
  contract: ValidContractInstance,
) {
  CONTRACT_CACHE.set(address, contract);
}

export function getCachedStorage(storage?: ThirdwebStorage): ThirdwebStorage {
  return storage || (STORAGE_CACHE.get("cache") as ThirdwebStorage);
}
