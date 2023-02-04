import { useDashboardNetwork } from "@3rdweb-sdk/react";
import { Stack } from "@chakra-ui/react";
import { UseMutationResult } from "@tanstack/react-query";
import { TransactionButton } from "components/buttons/TransactionButton";
import { BigNumberish } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";

interface CancelTabProps {
  cancelQuery: UseMutationResult<any, unknown, BigNumberish, unknown>;
  id: string;
}

export const CancelTab: React.FC<CancelTabProps> = ({ cancelQuery, id }) => {
  const trackEvent = useTrack();
  const network = useDashboardNetwork();

  const { onSuccess, onError } = useTxNotifications(
    "Listing cancelled",
    "Error cancelling listing",
  );
  return (
    <Stack pt={3} gap={3}>
      {/* maybe some text? */}
      <TransactionButton
        transactionCount={1}
        isLoading={cancelQuery.isLoading}
        onClick={() => {
          trackEvent({
            category: "marketplace",
            action: "cancel-listing",
            label: "attempt",
          });
          cancelQuery.mutate(id, {
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
          });
        }}
        colorScheme="primary"
        alignSelf="flex-end"
      >
        Cancel Listing
      </TransactionButton>
    </Stack>
  );
};
