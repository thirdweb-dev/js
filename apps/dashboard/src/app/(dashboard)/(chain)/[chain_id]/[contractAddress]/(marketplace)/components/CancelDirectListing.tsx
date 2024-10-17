import type { ThirdwebContract } from "thirdweb";
import { CancelTab } from "./cancel-tab";

interface CancelDirectListingProps {
  contract: ThirdwebContract;
  listingId: string;
}

export const CancelDirectListing: React.FC<CancelDirectListingProps> = ({
  contract,
  listingId,
}) => {
  return <CancelTab contract={contract} id={listingId} />;
};
