import {
  useCreateWalletInstance,
  useSupportedWallet,
  useWallet,
} from "@thirdweb-dev/react-core";
import { useContext, useEffect, useRef, useState } from "react";
import { Wallet } from "@thirdweb-dev/react-core";
import type { LocalWallet } from "@thirdweb-dev/wallets";
import { WalletData } from "@thirdweb-dev/wallets/src/evm/wallets/local-wallet";
import { createContext } from "react";
import { LocalWalletObj } from "../../../wallets/localWallet";

type LocalWalletInfo = {
  localWallet: LocalWallet | null;
  setLocalWallet: (wallet: LocalWallet) => void;
  walletData: WalletData | null | "loading";
  meta: Wallet["meta"];
  persist: LocalWalletObj["config"]["persist"];
};

const LocalWalletInfoCtx = createContext<LocalWalletInfo | undefined>(
  undefined,
);

export const LocalWalletInfoProvider: React.FC<React.PropsWithChildren<{}>> = (
  props,
) => {
  const [walletData, setWalletData] = useState<WalletData | null | "loading">(
    "loading",
  );
  const createWalletInstance = useCreateWalletInstance();
  const localWalletObj = useSupportedWallet("localWallet") as LocalWalletObj;
  const [localWallet, setLocalWallet] = useState<LocalWallet | null>(null);
  const activeWallet = useWallet();
  const prevActiveWallet = useRef(activeWallet);
  const { persist } = localWalletObj.config;

  // when wallet is disconnected, reset local wallet
  useEffect(() => {
    if (!activeWallet && prevActiveWallet.current) {
      setLocalWallet(null);
    }
    prevActiveWallet.current = activeWallet;
  }, [activeWallet]);

  useEffect(() => {
    const wallet = createWalletInstance(localWalletObj) as LocalWallet;
    setLocalWallet(wallet);

    if (persist) {
      wallet.getSavedData().then((data) => {
        setWalletData(data);
      });
    }
  }, [createWalletInstance, localWalletObj, persist]);

  return (
    <LocalWalletInfoCtx.Provider
      value={{
        setLocalWallet,
        localWallet,
        walletData,
        meta: localWalletObj.meta,
        persist,
      }}
    >
      {props.children}
    </LocalWalletInfoCtx.Provider>
  );
};

export function useLocalWalletInfo() {
  const ctx = useContext(LocalWalletInfoCtx);

  if (!ctx) {
    throw new Error(
      "useLocalWalletInfo() must be used within a LocalWalletInfoProvider",
    );
  }

  return ctx;
}
