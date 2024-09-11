import { useWalletNFTs } from "@3rdweb-sdk/react";
import { NFTCards } from "contract-ui/tabs/overview/components/NFTCards";
import type { ThirdwebContract } from "thirdweb";
import { Text } from "tw-components";

interface NftsOwnedProps {
  contract: ThirdwebContract;
}

export const NftsOwned: React.FC<NftsOwnedProps> = ({ contract }) => {
  const { data: walletNFTs, isLoading: isWalletNFTsLoading } = useWalletNFTs(
    contract.address,
    contract.chain.id,
  );

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
      isLoading={isWalletNFTsLoading}
      trackingCategory="account_nfts_owned"
    />
  ) : isWalletNFTsLoading ? null : error ? (
    <Text>Failed to fetch NFTs for this account: {error}</Text>
  ) : (
    <Text>This account doesn&apos;t own any NFTs.</Text>
  );
};
