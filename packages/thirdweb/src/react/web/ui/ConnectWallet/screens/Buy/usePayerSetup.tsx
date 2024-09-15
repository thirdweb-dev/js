import { useEffect, useState } from "react";
import { useActiveAccount } from "../../../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../../../core/hooks/wallets/useActiveWallet.js";
import { useActiveWalletChain } from "../../../../../core/hooks/wallets/useActiveWalletChain.js";
import type { PayerInfo } from "./types.js";

export function usePayerSetup() {
  const wallet = useActiveWallet();
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();

  const [_payer, setPayer] = useState<PayerInfo | undefined>();

  useEffect(() => {
    const wallet = _payer?.wallet;

    function update() {
      if (!wallet) {
        setPayer(undefined);
        return;
      }

      const account = wallet.getAccount();
      const chain = wallet.getChain();
      if (account && chain) {
        setPayer({
          account,
          chain,
          wallet,
        });
      } else {
        setPayer(undefined);
      }
    }

    if (wallet) {
      const unsubChainChanged = wallet.subscribe("chainChanged", update);
      const unsubAccountChanged = wallet.subscribe("accountChanged", update);
      return () => {
        unsubChainChanged();
        unsubAccountChanged();
      };
    }

    return undefined;
  }, [_payer]);

  const initialPayer =
    account && activeChain && wallet
      ? { account, chain: activeChain, wallet }
      : undefined;

  // return the payer state if its set
  // otherwise return the active wallet as payer
  const payer: PayerInfo | undefined = _payer || initialPayer;

  return {
    payer,
    setPayer,
  };
}
