import { useDashboardEVMChainId } from "./useActiveChainId";
import { useMutation } from "@tanstack/react-query";

export function useImportContract() {
  const chainId = useDashboardEVMChainId();

  return useMutation(async (contractAddress: string) => {
    const res = await fetch(
      `https://contract-importer-qj32.zeet-nftlabs.zeet.app/import`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractAddress,
          chainId,
        }),
      },
    );
    if (res.status >= 400) {
      throw new Error(await res.text().then((r) => r));
    }
    return res.json();
  });
}
