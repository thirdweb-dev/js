import { useEffect, useState } from "react";
import { fetchNFTs } from "../actions/fetchNFTs";

export interface NFTDetails {
  name: string;
  contractAddress: string;
  tokenId: string;
  imageUrl: string;
  blurHash: string;
}

export function useGetNFTs(chainId: number, address: string) {
  const [nfts, setNfts] = useState<NFTDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const nftData = await fetchNFTs({ chainId, address });
      setNfts(nftData);
      setIsLoading(false);
    })();
  }, [address, chainId]);

  return { nfts, isLoading };
}
