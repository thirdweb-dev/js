import { RequiredParam } from "./required-param";
import type { QueryKey } from "@tanstack/react-query";
import type { ValidContractInstance } from "@thirdweb-dev/sdk";

// we prefix all our query keys with this to avoid possible collisions with user-defined queries that share the same query client
const TW_QUERY_KEY_PREFIX = "__tw__";
// marker to make sure the query will not get stored in local storage by a query persister
const NEVER_PERSIST_QUERY_POSTFIX = { persist: false } as const;

export function ensureTWPrefix<TKey extends QueryKey>(key: TKey) {
  if (key[0] === TW_QUERY_KEY_PREFIX) {
    return key as unknown as Readonly<[typeof TW_QUERY_KEY_PREFIX, ...TKey]>;
  }
  return [TW_QUERY_KEY_PREFIX, ...key] as const;
}

export function neverPersist<TKey extends QueryKey>(key: TKey) {
  return [...key, NEVER_PERSIST_QUERY_POSTFIX] as const;
}

export function shouldNeverPersistQuery<TKey extends QueryKey>(
  key: TKey,
): boolean {
  return key[key.length - 1] === NEVER_PERSIST_QUERY_POSTFIX;
}

// EVM

export function createEVMQueryKey<TKey extends QueryKey>(key: TKey) {
  return ensureTWPrefix(["evm", ...key] as const);
}
export function createEVMQueryKeyWithChain<TKey extends QueryKey>(
  key: TKey,
  chainId: RequiredParam<number>,
) {
  return ensureTWPrefix([chainId, ...key] as const);
}

export function createEVMContractQueryKey<TKey extends QueryKey>(
  contract: RequiredParam<ValidContractInstance>,
  key: TKey = [] as unknown as TKey,
) {
  const chainId = contract?.chainId;
  const address = contract?.getAddress();
  return createEVMQueryKeyWithChain(
    ["contract", address, ...key] as const,
    chainId,
  );
}
