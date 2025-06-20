"use client";

import { useWalletNFTs } from "@3rdweb-sdk/react";
import type { ThirdwebContract } from "thirdweb";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { NFTCards } from "../../_components/NFTCards";

interface NftsOwnedProps {
  contract: ThirdwebContract;
  isInsightSupported: boolean;
  projectMeta: ProjectMeta | undefined;
}

export const NftsOwned: React.FC<NftsOwnedProps> = ({
  contract,
  isInsightSupported,
  projectMeta,
}) => {
  const { data: walletNFTs, isPending: isWalletNFTsLoading } = useWalletNFTs({
    chainId: contract.chain.id,
    isInsightSupported: isInsightSupported,
    walletAddress: contract.address,
  });

  const nfts = walletNFTs?.result || [];
  const error = walletNFTs?.error;

  return nfts.length !== 0 ? (
    <NFTCards
      allNfts
      client={contract.client}
      isPending={isWalletNFTsLoading}
      nfts={nfts.map((nft) => ({
        chainId: contract.chain.id,
        contractAddress: nft.contractAddress,
        id: BigInt(nft.id),
        metadata: nft.metadata,
        owner: nft.owner,
        supply: BigInt(nft.supply),
        tokenAddress: nft.tokenAddress,
        tokenURI: nft.tokenURI,
        type: nft.type,
      }))}
      projectMeta={projectMeta}
    />
  ) : isWalletNFTsLoading ? null : error ? (
    <p>Failed to fetch NFTs for this account: {error}</p>
  ) : (
    <p>This account doesn&apos;t own any NFTs.</p>
  );
};
