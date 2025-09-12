import { useMemo } from "react";
import { useActiveAccount } from "../../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../../core/hooks/wallets/useActiveWallet.js";
import { useActiveWalletChain } from "../../../../core/hooks/wallets/useActiveWalletChain.js";
import type { ActiveWalletInfo } from "./types.js";

export function useActiveWalletInfo(): ActiveWalletInfo | undefined {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const activeChain = useActiveWalletChain();

  return useMemo(() => {
    return activeAccount && activeWallet && activeChain
      ? {
          activeChain,
          activeWallet,
          activeAccount,
        }
      : undefined;
  }, [activeAccount, activeWallet, activeChain]);
}
