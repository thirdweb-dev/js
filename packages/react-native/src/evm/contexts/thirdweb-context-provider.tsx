import { getWalletMeta } from "../utils/wallets";
import { useWalletsContext } from "./wallets-context";
import { useActiveWallet } from "@thirdweb-dev/react-core";
import { PropsWithChildren, useEffect } from "react";
import React from "react";

export const ThirdwebContextProvider = ({ children }: PropsWithChildren) => {
  const activeWallet = useActiveWallet();
  const { setActiveWalletMeta } = useWalletsContext();

  useEffect(() => {
    if (activeWallet) {
      setActiveWalletMeta(getWalletMeta(activeWallet));
    } else {
      setActiveWalletMeta(undefined);
    }
  }, [activeWallet, setActiveWalletMeta]);

  return <>{children}</>;
};
