import { Stack } from "@chakra-ui/react";
import { useCancelListing } from "@thirdweb-dev/react";
import { ListingType } from "@thirdweb-dev/sdk";
import { Marketplace } from "@thirdweb-dev/sdk/dist/declarations/src/evm/contracts/prebuilt-implementations/marketplace";
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
            category: "listing",
            action: "cancel",
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
                  category: "listing",
                  action: "cancel",
                  label: "success",
                });
                onSuccess();
              },
              onError: (error) => {
                trackEvent({
                  category: "listing",
                  action: "cancel",
                  label: "error",
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
