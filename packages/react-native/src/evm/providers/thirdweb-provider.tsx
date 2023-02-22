import { ThirdwebProvider as ThirdwebProviderCore, ThirdwebProviderProps } from "@thirdweb-dev/react-core";
import { DeviceBrowserWallet, WalletConnect } from "@thirdweb-dev/wallets";
import React, { useMemo } from "react";
import { createAsyncLocalStorage } from "../../core/AsyncStorage";

export function ThirdwebProviderRN({children, createWalletStorage: createWalletStorageProp, supportedWallets, ...props} : 
  React.PropsWithChildren<{createWalletStorage?: ThirdwebProviderProps['createWalletStorage']} & Omit<
    ThirdwebProviderProps,
    "createWalletStorage"
  >>,
) {

  const supportedWalletsRN = useMemo(() => {
    if (!supportedWallets) {
      return [WalletConnect, DeviceBrowserWallet];
    }

    return supportedWallets.map((wallet) => {
      // for all wallets supported by wallet connect, we use wc in RN.
      return wallet.id !== 'deviceWallet' && wallet.id !== 'coinbaseWallet' ? WalletConnect : wallet
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
