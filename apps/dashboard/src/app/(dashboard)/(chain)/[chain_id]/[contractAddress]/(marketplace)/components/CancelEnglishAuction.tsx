import type { ThirdwebContract } from "thirdweb";
import { CancelTab } from "./cancel-tab";

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
