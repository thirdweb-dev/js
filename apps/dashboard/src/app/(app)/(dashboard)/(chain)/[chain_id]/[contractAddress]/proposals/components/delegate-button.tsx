"use client";

import { ToolTipLabel } from "@/components/ui/tooltip";
import {
  tokensDelegated,
  useDelegateMutation,
} from "@3rdweb-sdk/react/hooks/useVote";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { useActiveAccount, useReadContract } from "thirdweb/react";

interface VoteButtonProps {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}

export const DelegateButton: React.FC<VoteButtonProps> = ({
  contract,
  isLoggedIn,
}) => {
  const trackEvent = useTrack();
  const account = useActiveAccount();
  const tokensDelegatedQuery = useReadContract(tokensDelegated, {
    contract,
    account,
    queryOptions: {
      enabled: !!account,
    },
  });
  const delegateMutation = useDelegateMutation();

  if (tokensDelegatedQuery.data || tokensDelegatedQuery.isPending) {
    return null;
  }

  return (
    <ToolTipLabel label="You need to delegate tokens to this contract before you can make proposals and vote.">
      <TransactionButton
        client={contract.client}
        isLoggedIn={isLoggedIn}
        txChainID={contract.chain.id}
        transactionCount={1}
        onClick={() => {
          toast.promise(
            delegateMutation.mutateAsync(contract, {
              onSuccess: () => {
                trackEvent({
                  category: "vote",
                  action: "delegate",
                  label: "success",
                });
              },
              onError: (error) => {
                trackEvent({
                  category: "vote",
                  action: "delegate",
                  label: "error",
                  error,
                });
              },
            }),
            {
              loading: "Delegating tokens...",
              success: "Tokens delegated",
              error: "Error delegating tokens",
            },
          );
        }}
        isPending={delegateMutation.isPending}
      >
        Delegate Tokens
      </TransactionButton>
    </ToolTipLabel>
  );
};
