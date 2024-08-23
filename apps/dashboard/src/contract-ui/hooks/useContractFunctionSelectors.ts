import { selectorsFromBytecode } from "@shazow/whatsabi";
import { useQuery } from "@tanstack/react-query";
import type { ThirdwebContract } from "thirdweb";
import { resolveImplementation } from "thirdweb/utils";

export function useContractFunctionSelectors(contract: ThirdwebContract) {
  return useQuery({
    queryKey: ["contract-function-selectors", contract],
    queryFn: async () => {
      const { bytecode } = await resolveImplementation(contract);
      return selectorsFromBytecode(bytecode);
    },
    initialData: [],
  });
}
