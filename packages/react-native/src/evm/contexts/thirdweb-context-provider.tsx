import { getWalletMeta } from "../utils/wallets";
import { useWalletsContext } from "./wallets-context";
import { useActiveWallet } from "@thirdweb-dev/react-core";
import { WalletConnect, WalletConnectV1 } from "@thirdweb-dev/wallets";
import { PropsWithChildren, useEffect } from "react";
import React from "react";

export const ThirdwebContextProvider = ({ children }: PropsWithChildren) => {
  const activeWallet = useActiveWallet();
  const { setActiveWalletMeta } = useWalletsContext();

  useEffect(() => {
    if (activeWallet) {
      if (
        activeWallet instanceof WalletConnect ||
        activeWallet instanceof WalletConnectV1
      ) {
        setActiveWalletMeta(getWalletMeta(activeWallet));
      }
    } else {
      setActiveWalletMeta(undefined);
    }
  }, [activeWallet, setActiveWalletMeta]);

  return <>{children}</>;
};
