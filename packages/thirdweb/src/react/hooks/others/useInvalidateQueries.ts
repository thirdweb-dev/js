import { useQueryClient } from "@tanstack/react-query";

/**
 * @internal
 */
export function useInvalidateContractQuery() {
  const queryClient = useQueryClient();

  return (
    chainId: number,
    contractAddress: string,
  ) => {
    queryClient.invalidateQueries({
      predicate: (query) => {
        const [queryType, queriedChainId, queriedContractAddress] =
          query.queryKey;
        return (
          queryType === "readContract" &&
          queriedChainId === chainId &&
          queriedContractAddress === contractAddress
        );
      },
    });
  };
}
