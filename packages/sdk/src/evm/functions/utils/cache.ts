import { ContractPublisher } from "../../core/classes/contract-publisher";
import { ValidContractInstance } from "../../core/types";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

let STORAGE_CACHE = new ThirdwebStorage();
const CONTRACT_CACHE = new Map<string, ValidContractInstance>();
const PUBLISHER_CACHE = new Map<number, ContractPublisher>();

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

export function cacheStorage(storage: ThirdwebStorage) {
  STORAGE_CACHE = storage;
}

export function inPublisherCache(chainId: number): boolean {
  return PUBLISHER_CACHE.has(chainId);
}

export function getCachedPublisher(chainId: number): ContractPublisher {
  if (!inPublisherCache(chainId)) {
    throw new Error(`Publisher for chain ${chainId} was not found in cache`);
  }

  return PUBLISHER_CACHE.get(chainId) as ContractPublisher;
}

export function cachePublisher(publisher: ContractPublisher, chainId: number) {
  PUBLISHER_CACHE.set(chainId, publisher);
}
