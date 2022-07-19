import { useQueryWithNetwork } from "@3rdweb-sdk/react/hooks/query/useQueryWithNetwork";
import { useSDK } from "@thirdweb-dev/react";

export function useContractSources(contractAddress?: string) {
  const sdk = useSDK();
  return useQueryWithNetwork(
    ["contract-sources", contractAddress],
    async () => {
      return await sdk
        ?.getPublisher()
        .fetchContractSourcesFromAddress(contractAddress || "");
    },
    {
      enabled: !!contractAddress,
    },
  );
}
