"use client";
import { TransactionButton } from "components/buttons/TransactionButton";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { cancelAuction, cancelListing } from "thirdweb/extensions/marketplace";
import { useSendAndConfirmTransaction } from "thirdweb/react";

interface CancelTabProps {
  id: string;
  contract: ThirdwebContract;
  isAuction?: boolean;
  isLoggedIn: boolean;
}

export const CancelTab: React.FC<CancelTabProps> = ({
  id,
  contract,
  isAuction,
  isLoggedIn,
}) => {
  const transaction = isAuction
    ? cancelAuction({ contract, auctionId: BigInt(id) })
    : cancelListing({ contract, listingId: BigInt(id) });
  const cancelQuery = useSendAndConfirmTransaction();
  return (
    <div className="flex flex-col gap-3 pt-3">
      <TransactionButton
        client={contract.client}
        isLoggedIn={isLoggedIn}
        txChainID={contract.chain.id}
        transactionCount={1}
        isPending={cancelQuery.isPending}
        onClick={() => {
          const promise = cancelQuery.mutateAsync(transaction);
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
