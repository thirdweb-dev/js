import { useWalletNFTs } from "@3rdweb-sdk/react";
import { Box, Flex, Icon, Stack, Tooltip } from "@chakra-ui/react";
import { ListLabel } from "contract-ui/tabs/listings/components/list-label";
import { FiInfo } from "react-icons/fi";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";
import { Text } from "tw-components";

interface NftsOwnedProps {
  address: string;
}

export const NftsOwned: React.FC<NftsOwnedProps> = ({ address }) => {
  const { data: walletNFTs, isLoading: isWalletNFTsLoading } =
    useWalletNFTs(address);

  const nfts = walletNFTs?.result || [];

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
  ) : isWalletNFTsLoading ? null : (
    <Stack
      direction="row"
      bg="orange.50"
      borderRadius="md"
      borderWidth="1px"
      borderColor="orange.100"
      align="center"
      padding="10px"
      spacing={3}
      _dark={{
        bg: "orange.300",
        borderColor: "orange.300",
      }}
    >
      <Icon
        as={FiInfo}
        color="orange.400"
        _dark={{ color: "orange.900" }}
        boxSize={6}
      />
      <Text color="orange.800" _dark={{ color: "orange.900" }}>
        There are no NFTs owned by this wallet.
      </Text>
    </Stack>
  );
};
