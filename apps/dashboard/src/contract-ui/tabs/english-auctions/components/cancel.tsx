import { useCancelEnglishAuction } from "@thirdweb-dev/react";
import { MarketplaceV3 } from "@thirdweb-dev/sdk";
import { CancelTab } from "contract-ui/tabs/shared-components/cancel-tab";

interface CancelEnglishAuctionProps {
  contract: MarketplaceV3;
  auctionId: string;
}

export const CancelEnglishAuction: React.FC<CancelEnglishAuctionProps> = ({
  contract,
  auctionId,
}) => {
  const cancelEnglishAuction = useCancelEnglishAuction(contract);

  return <CancelTab cancelQuery={cancelEnglishAuction} id={auctionId} />;
};
