import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";
import { getWalletNFTs } from "@/actions/getWalletNFTs";

export function useWalletNFTs(params: {
  chainId: number;
  walletAddress?: string;
  isInsightSupported: boolean;
}) {
  return useQuery({
    enabled: !!params.walletAddress,
    queryFn: async () => {
      invariant(params.walletAddress, "walletAddress is required");
      return getWalletNFTs({
        chainId: params.chainId,
        isInsightSupported: params.isInsightSupported,
        owner: params.walletAddress,
      });
    },
    queryKey: ["walletNfts", params.chainId, params.walletAddress],
  });
}
