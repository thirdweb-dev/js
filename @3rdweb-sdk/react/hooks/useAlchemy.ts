import { AlchemyWeb3, createAlchemyWeb3 } from "@alch/alchemy-web3";

import { alchemyUrlMap } from "components/app-layouts/providers";
import { useEffect, useState } from "react";
import { SUPPORTED_CHAIN_ID } from "utils/network";
import { useActiveChainId, useWeb3 } from ".";
import { useQueryWithNetwork } from "./query/useQueryWithNetwork";

export function useAlchemy() {
  const activeChainId = useActiveChainId();
  const [alchemy, setAlchemy] = useState<AlchemyWeb3 | undefined>();

  useEffect(() => {
    if (activeChainId && activeChainId in alchemyUrlMap) {
      setAlchemy(
        createAlchemyWeb3(alchemyUrlMap[activeChainId as SUPPORTED_CHAIN_ID]),
      );
    }
  }, [activeChainId]);

  return { alchemy: alchemy?.alchemy };
}

export type WalletNftData = {
  contractAddress: string;
  tokenId: number;
  tokenType: "ERC1155" | "ERC721";
  image: string;
  name?: string;
};

export function useWalletNFTs() {
  const { address } = useWeb3();
  const { alchemy } = useAlchemy();

  return useQueryWithNetwork(
    ["walletNfts", address],
    async () => {
      if (!alchemy || !address) {
        return;
      }

      const data = await alchemy.getNfts({ owner: address });
      const nftData = data.ownedNfts
        .map((nft) => {
          if ((nft as any).metadata && (nft as any).metadata.image) {
            return {
              contractAddress: nft.contract.address,
              tokenId: parseInt(nft.id.tokenId, 16),
              ...(nft as any).metadata,
              image: (nft as any).metadata?.image.replace(
                "ipfs://",
                `${process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL}/`,
              ),
              tokenType: nft.id.tokenMetadata?.tokenType,
            };
          }

          return null;
        })
        .filter((nft) => !!nft);

      return nftData as WalletNftData[];
    },
    {
      enabled: !!alchemy && !!address,
    },
  );
}
