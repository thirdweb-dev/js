import { useQueryClient } from "@tanstack/react-query";

/**
 * @internal
 */
export function useInvalidateContractQuery() {
  const queryClient = useQueryClient();

  return ({
    chainId,
    contractAddress,
  }: {
    chainId: number;
    contractAddress: string;
  }) => {
    queryClient.invalidateQueries({
      queryKey: ["readContract", chainId, contractAddress],
    });
  };
}
