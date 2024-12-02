"use client";

import { useWalletNFTs } from "@3rdweb-sdk/react";
import type { ThirdwebContract } from "thirdweb";
import { NFTCards } from "../../_components/NFTCards";

interface NftsOwnedProps {
  contract: ThirdwebContract;
}

export const NftsOwned: React.FC<NftsOwnedProps> = ({ contract }) => {
  const { data: walletNFTs, isPending: isWalletNFTsLoading } = useWalletNFTs({
    chainId: contract.chain.id,
    walletAddress: contract.address,
  });

  const nfts = walletNFTs?.result || [];
  const error = walletNFTs?.error;

  return nfts.length !== 0 ? (
    <NFTCards
      nfts={nfts.map((nft) => ({
        id: BigInt(nft.id),
        supply: BigInt(nft.supply),
        owner: nft.owner,
        tokenURI: nft.tokenURI,
        metadata: nft.metadata,
        type: nft.type,
        contractAddress: nft.contractAddress,
        chainId: contract.chain.id,
      }))}
      allNfts
      isPending={isWalletNFTsLoading}
      trackingCategory="account_nfts_owned"
    />
  ) : isWalletNFTsLoading ? null : error ? (
    <p>Failed to fetch NFTs for this account: {error}</p>
  ) : (
    <p>This account doesn&apos;t own any NFTs.</p>
  );
};
