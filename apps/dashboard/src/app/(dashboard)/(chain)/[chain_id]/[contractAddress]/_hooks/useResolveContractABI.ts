import { useQuery } from "@tanstack/react-query";
import { type ThirdwebContract, resolveContractAbi } from "thirdweb/contract";

export function useResolveContractABI(contract: ThirdwebContract) {
  return useQuery({
    queryKey: ["resolveContractAbi", contract],
    queryFn: () => {
      return resolveContractAbi(contract);
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}
