import { Center, Icon } from "@chakra-ui/react";
import type { NFTMetadata } from "@thirdweb-dev/sdk";
import { FiImage } from "react-icons/fi";
import { NFTMedia } from "tw-components/nft-media";

interface MediaCellProps {
  cell: {
    value: NFTMetadata;
  };
}

export const MediaCell: React.FC<MediaCellProps> = ({ cell }) => {
  const nftMetadata = cell.value;

  if (!nftMetadata.uri) {
    return (
      <Center
        borderRadius="lg"
        boxSize={24}
        borderColor="accent.300"
        borderWidth="1px"
      >
        <Icon boxSize="25%" as={FiImage} color="accent.300" />
      </Center>
    );
  }
  return (
    <NFTMedia
      borderRadius="lg"
      pointerEvents="none"
      metadata={nftMetadata}
      requireInteraction
      flexShrink={0}
      boxSize={24}
      objectFit="contain"
    />
  );
};
