import { CancelTab } from "contract-ui/tabs/shared-components/cancel-tab";
import type { ThirdwebContract } from "thirdweb";

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
