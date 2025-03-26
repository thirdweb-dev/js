import { getWalletNFTs } from "@/actions/getWalletNFTs";
import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";

export function useWalletNFTs(params: {
  chainId: number;
  walletAddress?: string;
  isInsightSupported: boolean;
}) {
  return useQuery({
    queryKey: ["walletNfts", params.chainId, params.walletAddress],
    queryFn: async () => {
      invariant(params.walletAddress, "walletAddress is required");
      return getWalletNFTs({
        chainId: params.chainId,
        owner: params.walletAddress,
        isInsightSupported: params.isInsightSupported,
      });
    },
    enabled: !!params.walletAddress,
  });
}
