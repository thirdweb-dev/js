import { CancelTab } from "contract-ui/tabs/shared-components/cancel-tab";
import type { ThirdwebContract } from "thirdweb";

interface CancelEnglishAuctionProps {
  contract: ThirdwebContract;
  auctionId: string;
}

export const CancelEnglishAuction: React.FC<CancelEnglishAuctionProps> = ({
  contract,
  auctionId,
}) => {
  return <CancelTab contract={contract} id={auctionId} />;
};
