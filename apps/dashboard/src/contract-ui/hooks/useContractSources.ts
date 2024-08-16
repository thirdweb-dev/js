import { useQuery } from "@tanstack/react-query";
import type { ThirdwebContract } from "thirdweb";
import { getCompilerMetadata } from "thirdweb/contract";
import invariant from "tiny-invariant";

export function useContractSources(contract?: ThirdwebContract) {
  return useQuery(
    [
      "dashboard-contract-sources",
      contract?.chain.id || "",
      contract?.address || "",
    ],
    async (): Promise<Array<{ filename: string; source: string }>> => {
      invariant(contract, "contract is required");
      const data = await getCompilerMetadata(contract);
      const sources = data.metadata.sources || {};
      const arr = Object.keys(sources).map((key) => ({
        filename: key,
        source: sources[key]?.content || "",
      }));
      return arr;
    },
    { enabled: !!contract },
  );
}
