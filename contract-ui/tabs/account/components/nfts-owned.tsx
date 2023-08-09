import { useWalletNFTs } from "@3rdweb-sdk/react";
import { Box, Flex, Tooltip } from "@chakra-ui/react";
import { ListLabel } from "contract-ui/tabs/listings/components/list-label";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";
import { Text } from "tw-components";

interface NftsOwnedProps {
  address: string;
}

export const NftsOwned: React.FC<NftsOwnedProps> = ({ address }) => {
  const { data: walletNFTs, isLoading: isWalletNFTsLoading } =
    useWalletNFTs(address);

  const nfts = walletNFTs?.result || [];
  const error = walletNFTs?.error;

  return nfts.length !== 0 ? (
    <Flex gap={2} flexWrap="wrap">
      {nfts?.map((nft, id) => {
        return (
          <Tooltip
            bg="transparent"
            boxShadow="none"
            shouldWrapChildren
            placement="left-end"
            key={id}
            label={<ListLabel nft={nft} />}
          >
            <Box borderRadius="lg" cursor="pointer" overflow="hidden">
              <NFTMediaWithEmptyState
                metadata={nft.metadata}
                width="140px"
                height="140px"
                requireInteraction
              />
            </Box>
          </Tooltip>
        );
      })}
    </Flex>
  ) : isWalletNFTsLoading ? null : error ? (
    <Text>Failed to fetch NFTs for this account: {error}</Text>
  ) : (
    <Text>This account doesn&apos;t own any NFT.</Text>
  );
};
