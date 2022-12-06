import type { NFTMetadata } from "@thirdweb-dev/sdk";
import { NFTMedia } from "tw-components/nft-media";

interface MediaCellProps {
  cell: {
    value: NFTMetadata;
  };
}

export const MediaCell: React.FC<MediaCellProps> = ({ cell }) => {
  const nftMetadata = cell.value;
  return (
    <NFTMedia
      pointerEvents="none"
      metadata={nftMetadata}
      requireInteraction
      flexShrink={0}
      boxSize={24}
      objectFit="contain"
    />
  );
};
