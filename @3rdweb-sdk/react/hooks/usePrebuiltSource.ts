import { useQuery } from "@tanstack/react-query";
import { useContractType } from "@thirdweb-dev/react";
import { ContractType } from "@thirdweb-dev/sdk";
import { BuiltinContractMap } from "constants/mappings";

export function usePrebuiltSource(contractAddress: string | undefined) {
  const { data: contractType } = useContractType(contractAddress);
  const { sourceUrl } = BuiltinContractMap[contractType as ContractType];
  return useQuery(["prebuilt-source", contractType], async () => {
    if (contractType === "custom") {
      return undefined;
    }

    const res = await fetch(sourceUrl);
    const code = await res.text();
    const filename = sourceUrl.split("/").pop();
    const source = { filename, source: code };

    return source;
  });
}
