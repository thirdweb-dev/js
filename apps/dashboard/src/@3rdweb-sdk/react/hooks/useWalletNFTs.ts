import type { WalletNFTApiReturn } from "pages/api/wallet/nfts/[chainId]";
import { useQueryWithNetwork } from "./query/useQueryWithNetwork";

export function useWalletNFTs(walletAddress?: string, chainId?: number) {
  return useQueryWithNetwork(
    ["walletNfts", walletAddress],
    async () => {
      const response = await fetch(
        `/api/wallet/nfts/${chainId}?owner=${walletAddress}`,
      );
      return (await response.json()) as WalletNFTApiReturn;
    },
    {
      enabled: !!walletAddress && !!chainId,
    },
  );
}
