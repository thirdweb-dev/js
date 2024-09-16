import { networkKeys, useDashboardEVMChainId } from "@3rdweb-sdk/react";
import {
  type MutationFunction,
  type QueryFunction,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions,
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback } from "react";

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
  const activeChainId = useDashboardEVMChainId();

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

  return useQuery({
    ...mergedOptions,
    queryKey: combinedQueryKey,
    queryFn,
  });
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
      wrapCacheKeys: (
        cacheKeysToInvalidate: TQueryKey[],
        // biome-ignore lint/suspicious/noConfusingVoidType: FIX ME
      ) => Promise<void[]>,
    ) => Promise<unknown> | undefined;
  },
) {
  const activeChainId = useDashboardEVMChainId();
  const queryClient = useQueryClient();

  const invalidate = useCallback(
    (cacheKeysToInvalidate: TQueryKey[]) => {
      return Promise.all(
        cacheKeysToInvalidate.map((cacheKey) => {
          return queryClient.invalidateQueries({
            queryKey: (
              networkKeys.chain(activeChainId) as readonly unknown[]
            ).concat(cacheKey) as unknown[],
          });
        }),
      );
    },
    [queryClient, activeChainId],
  );

  return useMutation({
    ...options,
    mutationFn,
    onSuccess: (...args) => {
      if (options?.onSuccess) {
        options.onSuccess(...args, invalidate);
      }
    },
  });
}
