import { useMemo } from "react";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { useActiveAccount } from "../../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../../core/hooks/wallets/useActiveWallet.js";
import { useActiveWalletChain } from "../../../../core/hooks/wallets/useActiveWalletChain.js";
import type { ActiveWalletInfo } from "./types.js";

export function useActiveWalletInfo(
  activeWalletOverride?: Wallet,
): ActiveWalletInfo | undefined {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const activeChain = useActiveWalletChain();

  return useMemo(() => {
    const wallet = activeWalletOverride || activeWallet;
    const chain = activeWalletOverride?.getChain() || activeChain;
    const account = activeWalletOverride?.getAccount() || activeAccount;
    return wallet && chain && account
      ? {
          activeChain: chain,
          activeWallet: wallet,
          activeAccount: account,
        }
      : undefined;
  }, [activeAccount, activeWallet, activeChain, activeWalletOverride]);
}
