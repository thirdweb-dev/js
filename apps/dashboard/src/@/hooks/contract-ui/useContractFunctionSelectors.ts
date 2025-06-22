import { useQuery } from "@tanstack/react-query";
import type { ThirdwebContract } from "thirdweb";
import { resolveFunctionSelectors } from "@/lib/selectors";

export function useContractFunctionSelectors(contract: ThirdwebContract) {
  return useQuery({
    placeholderData: [],
    queryFn: () => resolveFunctionSelectors(contract),
    queryKey: [
      "contract-function-selectors",
      {
        address: contract.address,
        chainId: contract.chain.id,
      },
    ],
  });
}
