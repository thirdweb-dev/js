import { useQuery } from "@tanstack/react-query";
import type { Abi } from "abitype";
import type { ThirdwebContract } from "thirdweb";
import { resolveContractAbi } from "thirdweb/contract";
import invariant from "tiny-invariant";

export function useResolveContractAbi(contract?: ThirdwebContract) {
  return useQuery({
    queryKey: [
      "full-contract-abi",
      contract?.chain.id || "",
      contract?.address || "",
    ],
    queryFn: async () => {
      invariant(contract, "contract is required");
      const abi = await resolveContractAbi<Abi>(contract);
      return abi;
    },
    enabled: !!contract,
  });
}
