import type { ThirdwebClient } from "thirdweb";
import type { NFTMetadata } from "thirdweb/utils";
import { NFTMediaWithEmptyState } from "@/components/blocks/nft-media";

interface MediaCellProps {
  cell: {
    value: NFTMetadata;
  };
  client: ThirdwebClient;
}

export const MediaCell: React.FC<MediaCellProps> = ({ cell, client }) => {
  const nftMetadata = cell.value;

  return (
    <NFTMediaWithEmptyState
      className="pointer-events-none"
      client={client}
      height="120px"
      metadata={nftMetadata}
      requireInteraction
      width="120px"
    />
  );
};
