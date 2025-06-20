"use client";

import {
  tokensDelegated,
  useDelegateMutation,
} from "@3rdweb-sdk/react/hooks/useVote";
import { TransactionButton } from "components/buttons/TransactionButton";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { ToolTipLabel } from "@/components/ui/tooltip";

interface VoteButtonProps {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}

export const DelegateButton: React.FC<VoteButtonProps> = ({
  contract,
  isLoggedIn,
}) => {
  const account = useActiveAccount();
  const tokensDelegatedQuery = useReadContract(tokensDelegated, {
    account,
    contract,
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
        isPending={delegateMutation.isPending}
        onClick={() => {
          toast.promise(
            delegateMutation.mutateAsync(contract, {
              onError: (error) => {
                console.error(error);
              },
            }),
            {
              error: "Error delegating tokens",
              loading: "Delegating tokens...",
              success: "Tokens delegated",
            },
          );
        }}
        transactionCount={1}
        txChainID={contract.chain.id}
      >
        Delegate Tokens
      </TransactionButton>
    </ToolTipLabel>
  );
};
