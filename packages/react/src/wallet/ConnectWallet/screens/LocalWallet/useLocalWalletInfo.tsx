import { useCreateWalletInstance } from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import { LocalWallet, walletIds } from "@thirdweb-dev/wallets";
import { WalletData } from "@thirdweb-dev/wallets/src/evm/wallets/local-wallet";
import { LocalWalletObj } from "../../../wallets/localWallet";
import { WalletInfo } from "../../../types";

export function useLocalWalletInfo(walletsInfo: WalletInfo[]) {
  const localWalletInfo = walletsInfo.find(
    (w) => w.wallet.id === walletIds.localWallet,
  ) as WalletInfo;

  const localWalletObj = localWalletInfo.wallet as LocalWalletObj;

  const [walletData, setWalletData] = useState<WalletData | null | "loading">(
    "loading",
  );
  const createWalletInstance = useCreateWalletInstance();
  const [localWallet, setLocalWallet] = useState<LocalWallet | null>(null);
  const { persist } = localWalletObj.config;

  useEffect(() => {
    const wallet = createWalletInstance(localWalletObj) as LocalWallet;
    setLocalWallet(wallet);

    if (persist) {
      wallet.getSavedData().then((data) => {
        setWalletData(data);
      });
    }
  }, [createWalletInstance, localWalletObj, persist]);

  return {
    setLocalWallet,
    localWallet,
    walletData,
    meta: localWalletObj.meta,
    persist,
  };
}
