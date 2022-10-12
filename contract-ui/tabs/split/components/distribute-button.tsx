import {
  useSplitBalances,
  useSplitDistributeFunds,
} from "@3rdweb-sdk/react/hooks/useSplit";
import { UseContractResult } from "@thirdweb-dev/react";
import type { Split } from "@thirdweb-dev/sdk/evm";
import { MismatchButton } from "components/buttons/MismatchButton";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useMemo } from "react";
import { Button } from "tw-components";

export interface DistributeButtonProps {
  contractQuery?: UseContractResult<Split>;
  balances: ReturnType<typeof useSplitBalances>;
}

export const DistributeButton: React.FC<DistributeButtonProps> = ({
  contractQuery,
  balances,
  ...restButtonProps
}) => {
  const trackEvent = useTrack();
  const numTransactions = useMemo(() => {
    if (!balances.data || balances.isLoading) {
      return 0;
    }
    return balances.data?.filter((b) => b.display_balance !== "0.0").length;
  }, [balances.data, balances.isLoading]);

  const distibutedFundsMutation = useSplitDistributeFunds(
    contractQuery?.contract,
  );

  const { onSuccess, onError } = useTxNotifications(
    "Funds splitted successfully",
    "Failed to process transaction",
  );

  const distributeFunds = () => {
    distibutedFundsMutation.mutate(undefined, {
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

  if (balances.isError) {
    // if we fail to get the balances, we can't know how many transactions there are going to be
    // we still want to show the button, so we'll just show the mismatch button
    return (
      <MismatchButton
        isLoading={distibutedFundsMutation.isLoading}
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
      isLoading={balances.isLoading || distibutedFundsMutation.isLoading}
      colorScheme="primary"
      onClick={distributeFunds}
      {...restButtonProps}
    >
      Distribute Funds
    </TransactionButton>
  );
};
