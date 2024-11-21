"use client";

import { Button } from "@/components/ui/button";
import { useSplitDistributeFunds } from "@3rdweb-sdk/react/hooks/useSplit";
import { MismatchButton } from "components/buttons/MismatchButton";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import type { Balance } from "../ContractSplitPage";

interface DistributeButtonProps {
  contract: ThirdwebContract;
  balances: Balance[];
  balancesisPending: boolean;
  balancesIsError: boolean;
}

export const DistributeButton: React.FC<DistributeButtonProps> = ({
  contract,
  balances,
  balancesisPending,
  balancesIsError,
  ...restButtonProps
}) => {
  const trackEvent = useTrack();
  const validBalances = balances.filter(
    (item) => item.balance !== "0" && item.balance !== "0.0",
  );
  const numTransactions = useMemo(() => {
    if (
      validBalances.length === 1 &&
      validBalances[0]?.name === "Native Token"
    ) {
      return 1;
    }
    if (!validBalances || balancesisPending) {
      return 0;
    }
    return validBalances?.filter(
      (b) => b.display_balance !== "0.0" && b.display_balance !== "0",
    ).length;
  }, [validBalances, balancesisPending]);

  const mutation = useSplitDistributeFunds(contract);

  const { onSuccess, onError } = useTxNotifications(
    "Funds splitted successfully",
    "Failed to process transaction",
  );

  const distributeFunds = () => {
    mutation.mutate(undefined, {
      onSuccess: () => {
        onSuccess();
        trackEvent({
          category: "split",
          action: "distribute",
          label: "success",
        });
      },
      onError: (error) => {
        trackEvent({
          category: "split",
          action: "distribute",
          label: "error",
          error,
        });
        onError(error);
      },
    });
  };

  if (balancesIsError) {
    // if we fail to get the balances, we can't know how many transactions there are going to be
    // we still want to show the button, so we'll just show the mismatch button
    return (
      <MismatchButton
        isLoading={mutation.isPending}
        colorScheme="primary"
        onClick={distributeFunds}
        desiredChainId={contract.chain.id}
        {...restButtonProps}
      >
        Distribute Funds
      </MismatchButton>
    );
  }

  if (numTransactions === 0) {
    return (
      <Button disabled variant="primary" {...restButtonProps}>
        Nothing to distribute
      </Button>
    );
  }

  return (
    <TransactionButton
      transactionCount={numTransactions}
      isLoading={mutation.isPending}
      colorScheme="primary"
      onClick={distributeFunds}
      {...restButtonProps}
      txChainID={contract.chain.id}
    >
      Distribute Funds
    </TransactionButton>
  );
};
