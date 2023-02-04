import { useCancelDirectListing } from "@thirdweb-dev/react";
import { MarketplaceV3 } from "@thirdweb-dev/sdk";
import { CancelTab } from "contract-ui/tabs/shared-components/cancel-tab";

interface CancelDirectListingProps {
  contract: MarketplaceV3;
  listingId: string;
}

export const CancelDirectListing: React.FC<CancelDirectListingProps> = ({
  contract,
  listingId,
}) => {
  const cancelDirectListing = useCancelDirectListing(contract);

  return <CancelTab cancelQuery={cancelDirectListing} id={listingId} />;
};
