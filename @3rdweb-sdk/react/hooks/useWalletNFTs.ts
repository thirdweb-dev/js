import { useQueryWithNetwork } from "./query/useQueryWithNetwork";
import { useActiveChainId } from "./useActiveChainId";
import { useAddress } from "@thirdweb-dev/react";
import { WalletNFTApiReturn } from "pages/api/wallet/nfts/[chainId]";

export function useWalletNFTs() {
  const activeChainId = useActiveChainId();
  const address = useAddress();

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
