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

  const [amountNeeded, setAmountNeeded] = useState<string | undefined>(
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
        const totalCostWei = await getTotalTxCostForBuy(
          buyForTx.tx,
          account?.address,
        );

        if (!mounted) {
          return;
        }

        const totalCostUnits = toEther(totalCostWei);
        setAmountNeeded(totalCostUnits);

        if (shouldRefreshTokenAmount) {
          if (Number(totalCostUnits) > Number(buyForTx.balance)) {
            const _tokenAmount = String(
              formatNumber(
                Number(totalCostUnits) - Number(buyForTx.balance),
                4,
              ),
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

    if (!buyForTx.isCostOverridden) {
      pollTxCost();
    }

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
