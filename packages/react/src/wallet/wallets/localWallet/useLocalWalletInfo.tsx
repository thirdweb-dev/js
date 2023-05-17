import { useCreateWalletInstance } from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import { LocalWallet } from "@thirdweb-dev/wallets";
import { WalletData } from "@thirdweb-dev/wallets/src/evm/wallets/local-wallet";
import { LocalConfiguredWallet } from "./types";

export function useLocalWalletInfo(
  localConfiguredWallet: LocalConfiguredWallet,
  persist: boolean,
) {
  const [walletData, setWalletData] = useState<WalletData | null | "loading">(
    "loading",
  );
  const createWalletInstance = useCreateWalletInstance();
  const [localWallet, setLocalWallet] = useState<LocalWallet | null>(null);

  useEffect(() => {
    const wallet = createWalletInstance(localConfiguredWallet) as LocalWallet;
    setLocalWallet(wallet);

    if (persist) {
      wallet.getSavedData().then((data) => {
        setWalletData(data);
      });
    }
  }, [createWalletInstance, localConfiguredWallet, persist]);

  return {
    setLocalWallet,
    localWallet,
    walletData,
    meta: localConfiguredWallet.meta,
    persist: persist,
  };
}
