import { useSplitDistributeFunds } from "@3rdweb-sdk/react/hooks/useSplit";
import { MismatchButton } from "components/buttons/MismatchButton";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import { Button } from "tw-components";
import type { Balance } from "../page";

interface DistributeButtonProps {
  contract: ThirdwebContract;
  balances: Balance[];
  balancesIsLoading: boolean;
  balancesIsError: boolean;
}

export const DistributeButton: React.FC<DistributeButtonProps> = ({
  contract,
  balances,
  balancesIsLoading,
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
      validBalances[0].name === "Native Token"
    ) {
      return 1;
    }
    if (!validBalances || balancesIsLoading) {
      return 0;
    }
    return validBalances?.filter(
      (b) => b.display_balance !== "0.0" && b.display_balance !== "0",
    ).length;
  }, [validBalances, balancesIsLoading]);

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
        isLoading={mutation.isLoading}
        colorScheme="primary"
        onClick={distributeFunds}
        {...restButtonProps}
      >
        Distribute Funds
      </MismatchButton>
    );
  }

  if (numTransactions === 0) {
    return (
      <Button isDisabled colorScheme="primary" {...restButtonProps}>
        Nothing to distribute
      </Button>
    );
  }

  return (
    <TransactionButton
      transactionCount={numTransactions}
      isLoading={mutation.isLoading}
      colorScheme="primary"
      onClick={distributeFunds}
      {...restButtonProps}
    >
      Distribute Funds
    </TransactionButton>
  );
};
