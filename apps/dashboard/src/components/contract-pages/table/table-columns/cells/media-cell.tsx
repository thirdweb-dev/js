import type { ThirdwebClient } from "thirdweb";
import type { NFTMetadata } from "thirdweb/utils";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";

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
      client={client}
      className="pointer-events-none"
      metadata={nftMetadata}
      requireInteraction
      width="120px"
      height="120px"
    />
  );
};
