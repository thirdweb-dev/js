import { useQuery } from "@tanstack/react-query";
import { resolveFunctionSelectors } from "lib/selectors";
import type { ThirdwebContract } from "thirdweb";

export function useContractFunctionSelectors(contract: ThirdwebContract) {
  return useQuery({
    queryKey: [
      "contract-function-selectors",
      {
        chainId: contract.chain.id,
        address: contract.address,
      },
    ],
    queryFn: () => resolveFunctionSelectors(contract),
    placeholderData: [],
  });
}
