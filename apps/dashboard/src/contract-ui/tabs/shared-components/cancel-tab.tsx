import { thirdwebClient } from "@/constants/client";
import { useEVMContractInfo } from "@3rdweb-sdk/react";
import { Stack } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useV5DashboardChain } from "lib/v5-adapter";
import { getContract } from "thirdweb";
import { cancelAuction, cancelListing } from "thirdweb/extensions/marketplace";
import { useSendAndConfirmTransaction } from "thirdweb/react";

interface CancelTabProps {
  id: string;
  contractAddress: string;
  chainId: number;
  isAuction?: boolean;
}

export const CancelTab: React.FC<CancelTabProps> = ({
  id,
  contractAddress,
  chainId,
  isAuction,
}) => {
  const trackEvent = useTrack();
  const network = useEVMContractInfo()?.chain;
  const chain = useV5DashboardChain(chainId);
  const contract = getContract({
    address: contractAddress,
    chain: chain,
    client: thirdwebClient,
  });
  const transaction = isAuction
    ? cancelAuction({ contract, auctionId: BigInt(id) })
    : cancelListing({ contract, listingId: BigInt(id) });
  const { onSuccess, onError } = useTxNotifications(
    "Listing cancelled",
    "Error cancelling listing",
  );
  const cancelQuery = useSendAndConfirmTransaction();
  return (
    <Stack pt={3} gap={3}>
      {/* maybe some text? */}
      <TransactionButton
        transactionCount={1}
        isLoading={cancelQuery.isPending}
        onClick={() => {
          trackEvent({
            category: "marketplace",
            action: "cancel-listing",
            label: "attempt",
          });
          cancelQuery.mutate(transaction, {
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
