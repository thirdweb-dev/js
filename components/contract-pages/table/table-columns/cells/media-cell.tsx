import { chakra } from "@chakra-ui/react";
import { ThirdwebNftMedia } from "@thirdweb-dev/react";
import { NFTMetadata } from "@thirdweb-dev/sdk";

const ChakraThirdwebNftMedia = chakra(ThirdwebNftMedia);

interface MediaCellProps {
  cell: {
    value: NFTMetadata;
  };
}

export const MediaCell: React.FC<MediaCellProps> = ({ cell }) => {
  const nftMetadata = cell.value;
  return (
    <ChakraThirdwebNftMedia
      pointerEvents="none"
      metadata={nftMetadata}
      requireInteraction
      flexShrink={0}
      boxSize={24}
      objectFit="contain"
    />
  );
};
