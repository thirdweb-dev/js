import { useQueryClient } from "@tanstack/react-query";
import { invalidateContractAndBalances } from "@thirdweb-dev/react";

/**
 * @internal
 */
export function useInvalidatev4Contract() {
  const queryClient = useQueryClient();

  return ({
    chainId,
    contractAddress,
  }: {
    chainId: number;
    contractAddress: string;
  }) => invalidateContractAndBalances(queryClient, contractAddress, chainId);
}
