import { useActiveChainId } from "../../Provider";
import { createCacheKeyWithNetwork } from "../../utils/cache-keys";
import {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";

/** @internal */
export function useQueryWithNetwork<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey" | "queryFn"
  >,
): UseQueryResult<TData, TError> {
  const activeChainId = useActiveChainId();

  const mergedOptions: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey" | "queryFn"
  > = {
    ...options,
    enabled: !!(activeChainId && options?.enabled),
  };

  return useQuery<TQueryFnData, TError, TData, TQueryKey>(
    createCacheKeyWithNetwork(queryKey, activeChainId) as TQueryKey,
    queryFn,
    mergedOptions,
  );
}
