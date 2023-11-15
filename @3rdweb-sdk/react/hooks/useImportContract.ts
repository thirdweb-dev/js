import { useMutation } from "@tanstack/react-query";
import { Chain } from "@thirdweb-dev/chains";
import { useTrack } from "hooks/analytics/useTrack";

export function useImportContract() {
  const trackEvent = useTrack();

  return useMutation(
    async ({
      contractAddress,
      chain,
    }: {
      contractAddress: string;
      chain: Chain;
    }) => {
      trackEvent({
        category: "import-contract",
        action: "click",
        label: "attempt",
        contractAddress,
        network: chain,
      });
      const res = await fetch(`https://contract.thirdweb.com/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractAddress,
          chainId: chain.chainId,
        }),
      });
      if (res.status >= 400) {
        throw new Error(await res.text().then((r) => r));
      }

      return await res.json();
    },
    {
      onSuccess: (d, variables) => {
        trackEvent({
          category: "import-contract",
          action: "click",
          label: "success",
          contractAddress: variables.contractAddress,
          network: variables.chain,
        });
      },
      onError: (error, variables) => {
        trackEvent({
          category: "import-contract",
          action: "click",
          label: "error",
          error,
          contractAddress: variables.contractAddress,
          network: variables.chain,
        });
      },
    },
  );
}
