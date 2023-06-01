import { useCreateWalletInstance } from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import { LocalWallet } from "@thirdweb-dev/wallets";
import { WalletData } from "@thirdweb-dev/wallets/src/evm/wallets/local-wallet";
import { LocalWalletConfig } from "./types";

export function useLocalWalletInfo(localWalletConfig: LocalWalletConfig) {
  const [walletData, setWalletData] = useState<WalletData | null | "loading">(
    "loading",
  );
  const createWalletInstance = useCreateWalletInstance();
  const [localWallet, setLocalWallet] = useState<LocalWallet | null>(null);

  useEffect(() => {
    const wallet = createWalletInstance(localWalletConfig) as LocalWallet;
    setLocalWallet(wallet);

    if (localWalletConfig.config.persist) {
      wallet.getSavedData().then((data) => {
        setWalletData(data);
      });
    }
  }, [createWalletInstance, localWalletConfig]);

  return {
    setLocalWallet,
    localWallet,
    walletData,
    meta: localWalletConfig.meta,
    persist: localWalletConfig.config.persist,
  };
}
