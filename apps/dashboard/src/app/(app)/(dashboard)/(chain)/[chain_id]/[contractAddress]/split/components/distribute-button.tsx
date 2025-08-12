"use client";

import { SplitIcon } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import type { GetBalanceResult } from "thirdweb/extensions/erc20";
import { TransactionButton } from "@/components/tx-button";
import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useSplitDistributeFunds } from "@/hooks/useSplit";
import { parseError } from "@/utils/errorParser";

export const DistributeButton = ({
  contract,
  balances,
  balancesIsPending,
  balancesIsError,
  isLoggedIn,
}: {
  contract: ThirdwebContract;
  balances: GetBalanceResult[];
  balancesIsPending: boolean;
  balancesIsError: boolean;
  isLoggedIn: boolean;
}) => {
  const validBalances = balances.filter((item) => item.value !== 0n);
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
    return validBalances?.filter((b) => b.value !== 0n).length;
  }, [validBalances, balancesIsPending]);

  const mutation = useSplitDistributeFunds(contract);

  const distributeFunds = () => {
    mutation.mutate(undefined, {
      onError: (error) => {
        toast.error("Failed to process transaction", {
          description: parseError(error),
        });
        console.error(error);
      },
      onSuccess: () => {
        toast.success("Funds splitted successfully");
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
      >
        Distribute Funds
      </TransactionButton>
    );
  }

  if (numTransactions === 0) {
    return (
      <ToolTipLabel label="Nothing to distribute">
        <Button disabled variant="default" size="sm" className="gap-2">
          <SplitIcon className="size-3.5" />
          Distribute Funds
        </Button>
      </ToolTipLabel>
    );
  }

  return (
    <TransactionButton
      client={contract.client}
      isLoggedIn={isLoggedIn}
      isPending={mutation.isPending}
      onClick={distributeFunds}
      transactionCount={numTransactions}
      txChainID={contract.chain.id}
      variant="default"
      size="sm"
    >
      <SplitIcon className="size-3.5" />
      Distribute Funds
    </TransactionButton>
  );
};
