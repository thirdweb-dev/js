import type { QueryKey } from "@tanstack/react-query";

// marker to make sure the query will not get stored in local storage by a query persister
const NEVER_PERSIST_QUERY_POSTFIX = { persist: false } as const;

export function neverPersist<TKey extends QueryKey>(key: TKey) {
  return [...key, NEVER_PERSIST_QUERY_POSTFIX] as const;
}

/**
 * @internal
 */
export function shouldNeverPersistQuery<TKey extends QueryKey>(
  key: TKey,
): boolean {
  return key[key.length - 1] === NEVER_PERSIST_QUERY_POSTFIX;
}
