"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useAllChainsData } from "hooks/chains/allChains";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { cancelAuction, cancelListing } from "thirdweb/extensions/marketplace";
import { useSendAndConfirmTransaction } from "thirdweb/react";

interface CancelTabProps {
  id: string;
  contract: ThirdwebContract;
  isAuction?: boolean;
  twAccount: Account | undefined;
}

export const CancelTab: React.FC<CancelTabProps> = ({
  id,
  contract,
  isAuction,
  twAccount,
}) => {
  const trackEvent = useTrack();
  const { idToChain } = useAllChainsData();
  const network = idToChain.get(contract.chain.id);
  const transaction = isAuction
    ? cancelAuction({ contract, auctionId: BigInt(id) })
    : cancelListing({ contract, listingId: BigInt(id) });
  const cancelQuery = useSendAndConfirmTransaction();
  return (
    <div className="flex flex-col gap-3 pt-3">
      <TransactionButton
        twAccount={twAccount}
        txChainID={contract.chain.id}
        transactionCount={1}
        isPending={cancelQuery.isPending}
        onClick={() => {
          trackEvent({
            category: "marketplace",
            action: "cancel-listing",
            label: "attempt",
          });
          const promise = cancelQuery.mutateAsync(transaction, {
            onSuccess: () => {
              trackEvent({
                category: "marketplace",
                action: "cancel-listing",
                label: "success",
                network,
              });
            },
            onError: (error) => {
              trackEvent({
                category: "marketplace",
                action: "cancel-listing",
                label: "error",
                network,
                error,
              });
              console.error(error);
            },
          });
          toast.promise(promise, {
            loading: `Cancelling ${isAuction ? "auction" : "listing"}`,
            success: "Item cancelled successfully",
            error: "Failed to cancel",
          });
        }}
        className="self-end"
      >
        Cancel {isAuction ? "Auction" : "Listing"}
      </TransactionButton>
    </div>
  );
};
