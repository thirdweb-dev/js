import { useQuery } from "@tanstack/react-query";
import type { WalletNFTApiReturn } from "pages/api/wallet/nfts/[chainId]";

export function useWalletNFTs(params: {
  chainId: number;
  walletAddress?: string;
}) {
  return useQuery({
    queryKey: ["walletNfts", params.chainId, params.walletAddress],
    queryFn: async () => {
      const response = await fetch(
        `/api/wallet/nfts/${params.chainId}?owner=${params.walletAddress}`,
      );
      return (await response.json()) as WalletNFTApiReturn;
    },
    enabled: !!params.walletAddress,
  });
}
