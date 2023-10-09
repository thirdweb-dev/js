import { useEVMContractInfo } from "@3rdweb-sdk/react";
import { Stack } from "@chakra-ui/react";
import { useCancelListing } from "@thirdweb-dev/react";
import type { ListingType, Marketplace } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";

interface CancelTabProps {
  contract: Marketplace;
  listingId: string;
  listingType: ListingType;
}

export const CancelTab: React.FC<CancelTabProps> = ({
  contract,
  listingId,
  listingType,
}) => {
  const trackEvent = useTrack();
  const network = useEVMContractInfo()?.chain;

  const cancelListing = useCancelListing(contract);

  const { onSuccess, onError } = useTxNotifications(
    "Listing cancelled",
    "Error cancelling listing",
  );
  return (
    <Stack pt={3} gap={3}>
      {/* maybe some text? */}
      <TransactionButton
        transactionCount={1}
        isLoading={cancelListing.isLoading}
        onClick={() => {
          trackEvent({
            category: "marketplace",
            action: "cancel-listing",
            label: "attempt",
          });
          cancelListing.mutate(
            {
              id: listingId,
              type: listingType,
            },
            {
              onSuccess: () => {
                trackEvent({
                  category: "marketplace",
                  action: "cancel-listing",
                  label: "success",
                  network,
                });
                onSuccess();
              },
              onError: (error) => {
                trackEvent({
                  category: "marketplace",
                  action: "cancel-listing",
                  label: "error",
                  network,
                  error,
                });
                onError(error);
              },
            },
          );
        }}
        colorScheme="primary"
        alignSelf="flex-end"
      >
        Cancel Listing
      </TransactionButton>
    </Stack>
  );
};
