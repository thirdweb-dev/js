"use client";

import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { TransactionButton } from "@/components/tx-button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { tokensDelegated, useDelegateMutation } from "@/hooks/useVote";
import { parseError } from "@/utils/errorParser";

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
        size="sm"
        variant="default"
        client={contract.client}
        isLoggedIn={isLoggedIn}
        isPending={delegateMutation.isPending}
        onClick={async () => {
          await delegateMutation.mutateAsync(contract, {
            onError: (error) => {
              toast.error("Failed to delegate tokens", {
                description: parseError(error),
              });
              console.error(error);
            },
            onSuccess: () => {
              toast.success("Tokens delegated successfully");
            },
          });
        }}
        transactionCount={undefined}
        txChainID={contract.chain.id}
      >
        Delegate Tokens
      </TransactionButton>
    </ToolTipLabel>
  );
};
