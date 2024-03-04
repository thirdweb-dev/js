import { useQueryClient } from "@tanstack/react-query";

/**
 * @internal
 */
export function useInvalidateContractQuery(
  chainId: number,
  contractAddress: string,
) {
  const queryClient = useQueryClient();

  return () => {
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
