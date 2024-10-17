"use client";

import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useAllChainsData } from "hooks/chains/allChains";
import { useTxNotifications } from "hooks/useTxNotifications";
import type { ThirdwebContract } from "thirdweb";
import { cancelAuction, cancelListing } from "thirdweb/extensions/marketplace";
import { useSendAndConfirmTransaction } from "thirdweb/react";

interface CancelTabProps {
  id: string;
  contract: ThirdwebContract;
  isAuction?: boolean;
}

export const CancelTab: React.FC<CancelTabProps> = ({
  id,
  contract,
  isAuction,
}) => {
  const trackEvent = useTrack();
  const { idToChain } = useAllChainsData();
  const network = idToChain.get(contract.chain.id);
  const transaction = isAuction
    ? cancelAuction({ contract, auctionId: BigInt(id) })
    : cancelListing({ contract, listingId: BigInt(id) });
  const { onSuccess, onError } = useTxNotifications(
    "Listing cancelled",
    "Error cancelling listing",
  );
  const cancelQuery = useSendAndConfirmTransaction();
  return (
    <div className="flex flex-col gap-3 pt-3">
      {/* maybe some text? */}
      <TransactionButton
        txChainID={contract.chain.id}
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
    </div>
  );
};
