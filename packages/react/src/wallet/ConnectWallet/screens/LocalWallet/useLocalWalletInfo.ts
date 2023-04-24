import {
  useCreateWalletInstance,
  useSupportedWallet,
} from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import { Wallet } from "@thirdweb-dev/react-core";
import type { LocalWallet } from "@thirdweb-dev/wallets";
import { WalletData } from "@thirdweb-dev/wallets/src/evm/wallets/local-wallet";

export function useLocalWalletInfo() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const createWalletInstance = useCreateWalletInstance();
  const localWalletObj = useSupportedWallet("localWallet") as Wallet;
  const [localWallet, setLocalWallet] = useState<LocalWallet | null>(null);
  const [storageLoading, setStorageLoading] = useState(false);

  useEffect(() => {
    const wallet = createWalletInstance(localWalletObj) as LocalWallet;
    setLocalWallet(wallet);
    wallet.getSavedData().then((data) => {
      setStorageLoading(false);
      setWalletData(data);
    });
  }, [createWalletInstance, localWalletObj]);

  return {
    localWallet,
    storageLoading,
    walletData,
    meta: localWalletObj.meta,
    refreshSavedData() {
      if (!localWallet) {
        return;
      }
      localWallet.getSavedData().then((data) => {
        setStorageLoading(false);
        setWalletData(data);
      });
    },
  };
}
