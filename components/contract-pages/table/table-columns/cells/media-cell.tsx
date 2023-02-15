import type { NFTMetadata } from "@thirdweb-dev/sdk";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";

interface MediaCellProps {
  cell: {
    value: NFTMetadata;
  };
}

export const MediaCell: React.FC<MediaCellProps> = ({ cell }) => {
  const nftMetadata = cell.value;

  return (
    <NFTMediaWithEmptyState
      pointerEvents="none"
      metadata={nftMetadata}
      requireInteraction
      width="120px"
      height="120px"
    />
  );
};
