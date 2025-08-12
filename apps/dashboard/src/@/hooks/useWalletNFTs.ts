import { useQuery } from "@tanstack/react-query";
import type { Chain, ThirdwebClient } from "thirdweb";
import { getOwnedNFTs } from "thirdweb/insight";
import invariant from "tiny-invariant";

export function useOwnedNFTsInsight(params: {
  chainId: number;
  walletAddress?: string;
  isInsightSupported: boolean;
  client: ThirdwebClient;
  chain: Chain;
}) {
  return useQuery({
    enabled: !!params.walletAddress,
    queryFn: async () => {
      invariant(params.walletAddress, "walletAddress is required");

      if (!params.isInsightSupported) {
        throw new Error("Unsupported chain");
      }

      const res = await getOwnedNFTs({
        client: params.client,
        chains: [params.chain],
        ownerAddress: params.walletAddress,
      });

      return res;
    },
    queryKey: ["walletNfts", params.chainId, params.walletAddress],
  });
}
