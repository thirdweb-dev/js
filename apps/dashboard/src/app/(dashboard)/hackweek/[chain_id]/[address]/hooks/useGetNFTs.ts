import { useEffect, useState } from "react";
import { fetchNFTs } from "../actions/fetchNFTs";

export interface NFTDetails {
  name: string;
  description?: string;
  contractAddress: string;
  contractType: "ERC721" | "ERC1155";
  tokenId: string;
  quantity: number;
  firstAcquiredDate?: string;
  lastAcquiredDate?: string;
  imageUrl: string;
  createdAt?: string;
  tokenCount?: number;
  ownerCount?: number;
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
