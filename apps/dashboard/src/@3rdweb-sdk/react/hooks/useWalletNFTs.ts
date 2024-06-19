import { useQueryWithNetwork } from "./query/useQueryWithNetwork";
import { useDashboardEVMChainId } from "./useActiveChainId";
import { useAddress } from "@thirdweb-dev/react";
import { WalletNFTApiReturn } from "pages/api/wallet/nfts/[chainId]";

export function useWalletNFTs(walletAddress?: string) {
  const activeChainId = useDashboardEVMChainId();
  const connectedAddress = useAddress();

  const address = walletAddress || connectedAddress;

  return useQueryWithNetwork(
    ["walletNfts", address],
    async () => {
      const response = await fetch(
        `/api/wallet/nfts/${activeChainId}?owner=${address}`,
      );
      return (await response.json()) as WalletNFTApiReturn;
    },
    {
      enabled: !!address && !!activeChainId,
    },
  );
}
