import { networkKeys, useActiveChainId } from "@3rdweb-sdk/react";
import { useCallback } from "react";
import {
  MutationFunction,
  QueryFunction,
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";

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

  const combinedQueryKey = (
    networkKeys.chain(activeChainId) as readonly unknown[]
  ).concat(queryKey) as unknown as TQueryKey;
  return useQuery(combinedQueryKey, queryFn, mergedOptions);
}
export function useMutationWithInvalidate<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
  TQueryKey extends QueryKey = QueryKey,
>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationFn" | "onSuccess"
  > & {
    onSuccess?: (
      data: TData,
      variables: TVariables,
      context: TContext | undefined,
      wrapCacheKeys: (cacheKeysToInvalidate: TQueryKey[]) => Promise<void[]>,
    ) => Promise<unknown> | void;
  },
) {
  const activeChainId = useActiveChainId();
  const queryClient = useQueryClient();

  const invalidate = useCallback(
    (cacheKeysToInvalidate: TQueryKey[]) => {
      return Promise.all(
        cacheKeysToInvalidate.map((cacheKey) => {
          return queryClient.invalidateQueries(
            (networkKeys.chain(activeChainId) as readonly unknown[]).concat(
              cacheKey,
            ) as unknown[],
          );
        }),
      );
    },
    [queryClient, activeChainId],
  );

  return useMutation(mutationFn, {
    ...options,
    onSuccess: (...args) => {
      if (options?.onSuccess) {
        options.onSuccess(...args, invalidate);
      }
    },
  });
}
