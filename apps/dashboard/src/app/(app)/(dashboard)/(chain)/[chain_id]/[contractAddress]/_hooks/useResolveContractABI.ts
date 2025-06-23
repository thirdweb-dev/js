import { useQuery } from "@tanstack/react-query";
import { resolveContractAbi, type ThirdwebContract } from "thirdweb/contract";

export function useResolveContractABI(contract: ThirdwebContract) {
  return useQuery({
    queryFn: () => {
      return resolveContractAbi(contract);
    },
    queryKey: ["resolveContractAbi", contract],
    refetchOnWindowFocus: false,
    retry: false,
  });
}
