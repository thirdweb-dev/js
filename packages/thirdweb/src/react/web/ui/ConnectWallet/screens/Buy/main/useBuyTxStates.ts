import { useEffect, useState } from "react";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { toEther } from "../../../../../../../utils/units.js";
import type { Account } from "../../../../../../../wallets/interfaces/wallet.js";
import { getTotalTxCostForBuy } from "../../../../../../core/hooks/contract/useSendTransaction.js";
import { wait } from "../../../../../../core/utils/wait.js";
import type { BuyForTx } from "./types.js";

export function useBuyTxStates(options: {
  setTokenAmount: (value: string) => void;
  buyForTx?: BuyForTx;
  hasEditedAmount: boolean;
  isMainScreen: boolean;
  account?: Account;
}) {
  const { buyForTx, hasEditedAmount, isMainScreen, setTokenAmount, account } =
    options;
  const shouldRefreshTokenAmount = !hasEditedAmount && isMainScreen;
  const stopUpdatingAll = !isMainScreen;

  const [amountNeeded, setAmountNeeded] = useState<bigint | undefined>(
    buyForTx?.cost,
  );

  // update amount needed every 30 seconds
  // also update the token amount if allowed
  // ( Can't use useQuery because tx can't be added to queryKey )
  useEffect(() => {
    if (!buyForTx || stopUpdatingAll) {
      return;
    }

    let mounted = true;

    async function pollTxCost() {
      if (!buyForTx || !mounted) {
        return;
      }

      try {
        const totalCost = await getTotalTxCostForBuy(buyForTx.tx, account);

        if (!mounted) {
          return;
        }

        setAmountNeeded(totalCost);

        if (shouldRefreshTokenAmount) {
          if (totalCost > buyForTx.balance) {
            const _tokenAmount = String(
              formatNumber(Number(toEther(totalCost - buyForTx.balance)), 4),
            );
            setTokenAmount(_tokenAmount);
          }
        }
      } catch {
        // no op
      }

      await wait(30000);
      pollTxCost();
    }

    pollTxCost();

    return () => {
      mounted = false;
    };
  }, [
    buyForTx,
    shouldRefreshTokenAmount,
    setTokenAmount,
    stopUpdatingAll,
    account,
  ]);

  return {
    amountNeeded,
  };
}
