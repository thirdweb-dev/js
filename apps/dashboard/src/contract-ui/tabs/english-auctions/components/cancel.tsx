import { CancelTab } from "contract-ui/tabs/shared-components/cancel-tab";

interface CancelEnglishAuctionProps {
  contractAddress: string;
  chainId: number;
  auctionId: string;
}

export const CancelEnglishAuction: React.FC<CancelEnglishAuctionProps> = ({
  contractAddress,
  chainId,
  auctionId,
}) => {
  return (
    <CancelTab
      contractAddress={contractAddress}
      chainId={chainId}
      id={auctionId}
    />
  );
};
