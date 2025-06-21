"use client";

import { useSplitDistributeFunds } from "@3rdweb-sdk/react/hooks/useSplit";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import { Button } from "@/components/ui/button";
import type { Balance } from "../ContractSplitPage";

interface DistributeButtonProps {
  contract: ThirdwebContract;
  balances: Balance[];
  balancesIsPending: boolean;
  balancesIsError: boolean;
  isLoggedIn: boolean;
}

export const DistributeButton: React.FC<DistributeButtonProps> = ({
  contract,
  balances,
  balancesIsPending,
  balancesIsError,
  isLoggedIn,
  ...restButtonProps
}) => {
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
    if (!validBalances || balancesIsPending) {
      return 0;
    }
    return validBalances?.filter(
      (b) => b.display_balance !== "0.0" && b.display_balance !== "0",
    ).length;
  }, [validBalances, balancesIsPending]);

  const mutation = useSplitDistributeFunds(contract);

  const { onSuccess, onError } = useTxNotifications(
    "Funds splitted successfully",
    "Failed to process transaction",
  );

  const distributeFunds = () => {
    mutation.mutate(undefined, {
      onError: (error) => {
        console.error(error);
        onError(error);
      },
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  if (balancesIsError) {
    return (
      <TransactionButton
        client={contract.client}
        isLoggedIn={isLoggedIn}
        isPending={mutation.isPending}
        onClick={distributeFunds}
        transactionCount={undefined}
        // if we fail to get the balances, we can't know how many transactions there are going to be
        txChainID={contract.chain.id}
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
      client={contract.client}
      isLoggedIn={isLoggedIn}
      isPending={mutation.isPending}
      onClick={distributeFunds}
      transactionCount={numTransactions}
      {...restButtonProps}
      txChainID={contract.chain.id}
    >
      Distribute Funds
    </TransactionButton>
  );
};
