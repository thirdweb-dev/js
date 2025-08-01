"use client";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { cancelAuction, cancelListing } from "thirdweb/extensions/marketplace";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { TransactionButton } from "@/components/tx-button";

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
    ? cancelAuction({ auctionId: BigInt(id), contract })
    : cancelListing({ contract, listingId: BigInt(id) });
  const cancelQuery = useSendAndConfirmTransaction();
  return (
    <TransactionButton
      className="self-end"
      client={contract.client}
      isLoggedIn={isLoggedIn}
      isPending={cancelQuery.isPending}
      onClick={() => {
        const promise = cancelQuery.mutateAsync(transaction, {
          onError: (error) => {
            console.error(error);
          },
        });
        toast.promise(promise, {
          error: "Failed to cancel",
          loading: `Cancelling ${isAuction ? "auction" : "listing"}`,
          success: "Item cancelled successfully",
        });
      }}
      transactionCount={1}
      txChainID={contract.chain.id}
    >
      Cancel {isAuction ? "Auction" : "Listing"}
    </TransactionButton>
  );
};
