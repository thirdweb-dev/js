import { useCreateWalletInstance } from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import { LocalWallet } from "@thirdweb-dev/wallets";
import { WalletData } from "@thirdweb-dev/wallets/src/evm/wallets/local-wallet";
import { LocalWalletObj } from "../../../wallets/localWallet";
import { useWalletInfo } from "../../walletInfo";

export function useLocalWalletInfo() {
  const localWalletInfo = useWalletInfo("localWallet", true);
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
