import { CancelTab } from "contract-ui/tabs/shared-components/cancel-tab";

interface CancelDirectListingProps {
  contractAddress: string;
  chainId: number;
  listingId: string;
}

export const CancelDirectListing: React.FC<CancelDirectListingProps> = ({
  contractAddress,
  listingId,
  chainId,
}) => {
  return (
    <CancelTab
      contractAddress={contractAddress}
      chainId={chainId}
      id={listingId}
    />
  );
};
