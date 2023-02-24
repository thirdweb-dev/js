import { ThirdwebProvider as ThirdwebProviderCore, ThirdwebProviderProps } from "@thirdweb-dev/react-core";
import { DeviceBrowserWallet, WalletConnect, WalletConnectV1 } from "@thirdweb-dev/wallets";
import { wallets } from "../constants/wallets";
import { SupportedWallet } from "../types/wallet";
import React, { PropsWithChildren, useMemo } from "react";
import { createAsyncLocalStorage } from "../../core/AsyncStorage";

export type ThirdwebProviderRNProps = PropsWithChildren<{
  supportedWallets: SupportedWallet[]
  createWalletStorage?: ThirdwebProviderProps['createWalletStorage']
} & Omit<ThirdwebProviderProps, "supportedWallets" | "createWalletStorage">>;

export function ThirdwebProviderRN({children, createWalletStorage: createWalletStorageProp, supportedWallets, ...props} : ThirdwebProviderRNProps,
) {

  const supportedWalletsRN = useMemo(() => {
    if (!supportedWallets) {
      return [WalletConnect, DeviceBrowserWallet];
    }

    return supportedWallets.map((wallet) => {
      if (wallets[wallet].sdks.includes('sign_v2')) {
        return WalletConnect;
      } else {
        return WalletConnectV1;
      }
    });
  }, [supportedWallets]);


  return (
    <ThirdwebProviderCore
      {...props}
      supportedWallets={supportedWalletsRN}
      createWalletStorage={createWalletStorageProp || createAsyncLocalStorage}
    >
      {children}
    </ThirdwebProviderCore>
  );
}
