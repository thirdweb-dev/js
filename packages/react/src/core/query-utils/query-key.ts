import { RequiredParam } from "../types/shared";
import { QueryKey } from "@tanstack/react-query";
import type { ChainId } from "@thirdweb-dev/sdk";
import type {
  Network,
  NFTCollection,
  NFTDrop,
  Token,
} from "@thirdweb-dev/sdk/solana";

// we prefix all our query keys with this to avoid possible collisions with user-defined queries that share the same query client
const TW_QUERY_KEY_PREFIX = "__tw__";
// marker to make sure the query will not get stored in local storage by a query persister
const NEVER_PERSIST_QUERY_POSTFIX = { persist: false } as const;

function ensureTWPrefix<TKey extends QueryKey>(key: TKey) {
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
  return key[key.length] === NEVER_PERSIST_QUERY_POSTFIX;
}

// EVM

export function createEVMQueryKey<TKey extends QueryKey>(key: TKey) {
  return ensureTWPrefix(["evm", ...key] as const);
}
export function createEVMQueryKeyWithChain<TKey extends QueryKey>(
  key: TKey,
  chainId: RequiredParam<ChainId>,
) {
  return ensureTWPrefix([chainId, ...key] as const);
}

// SOL

export function createSOLQueryKey<TKey extends QueryKey>(key: TKey) {
  return ensureTWPrefix(["sol", ...key] as const);
}

export function createSOLQueryKeyWithNetwork<TKey extends QueryKey>(
  key: TKey,
  network: RequiredParam<Network>,
) {
  return createSOLQueryKey([network, ...key] as const);
}

export function createSOLProgramQueryKey<TKey extends QueryKey>(
  program: RequiredParam<NFTCollection | NFTDrop | Token>,
  key: TKey = [] as unknown as TKey,
) {
  const network = program?.network;
  const address = program?.publicKey.toBase58();
  return createSOLQueryKeyWithNetwork(
    ["program", address, ...key] as const,
    network || null,
  );
}
