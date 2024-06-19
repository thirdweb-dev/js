import { useWalletNFTs } from "@3rdweb-sdk/react";
import { Text } from "tw-components";
import { NFTCards } from "contract-ui/tabs/overview/components/NFTCards";

interface NftsOwnedProps {
  address: string;
}

export const NftsOwned: React.FC<NftsOwnedProps> = ({ address }) => {
  const { data: walletNFTs, isLoading: isWalletNFTsLoading } =
    useWalletNFTs(address);

  const nfts = walletNFTs?.result || [];
  const error = walletNFTs?.error;

  return nfts.length !== 0 ? (
    <NFTCards
      nfts={nfts}
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
