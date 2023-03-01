import { useWalletsContext } from "../contexts/wallets-context";
import { getWallets } from "../utils/wallets";
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
        console.log("setActiveWallet", activeWallet);
        setActiveWalletMeta(getWallets(activeWallet));
      }
    } else {
      setActiveWalletMeta(undefined);
    }
  }, [activeWallet, setActiveWalletMeta]);

  return <>{children}</>;
};
