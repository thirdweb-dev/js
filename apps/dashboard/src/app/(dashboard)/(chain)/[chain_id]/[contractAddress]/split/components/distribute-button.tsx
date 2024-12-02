"use client";

import { Button } from "@/components/ui/button";
import { useSplitDistributeFunds } from "@3rdweb-sdk/react/hooks/useSplit";
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
    return (
      <TransactionButton
        isPending={mutation.isPending}
        onClick={distributeFunds}
        txChainID={contract.chain.id}
        // if we fail to get the balances, we can't know how many transactions there are going to be
        transactionCount={undefined}
        {...restButtonProps}
      >
        Distribute Funds
      </TransactionButton>
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
      isPending={mutation.isPending}
      onClick={distributeFunds}
      {...restButtonProps}
      txChainID={contract.chain.id}
    >
      Distribute Funds
    </TransactionButton>
  );
};
