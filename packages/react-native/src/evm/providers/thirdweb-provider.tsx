import { createAsyncLocalStorage } from "../../core/AsyncStorage";
import { DEFAULT_API_KEY } from "../constants/rpc";
import { walletsMetadata } from "../constants/walletsMetadata";
import { WalletsProvider } from "../contexts/wallets-context";
import { SupportedWallet, WalletMeta } from "../types/wallet";
import { ThirdwebContextProvider } from "./thirdweb-context-provider";
import {
  ThirdwebProvider as ThirdwebProviderCore,
  ThirdwebProviderProps,
} from "@thirdweb-dev/react-core";
import {
  DeviceBrowserWallet,
  WalletConnect,
  WalletConnectV1,
} from "@thirdweb-dev/wallets";
import React, { PropsWithChildren, useMemo, useState } from "react";

export type ThirdwebProviderRNProps = PropsWithChildren<
  {
    supportedWallets: SupportedWallet[];
    createWalletStorage?: ThirdwebProviderProps["createWalletStorage"];
  } & Omit<ThirdwebProviderProps, "supportedWallets" | "createWalletStorage">
>;

export function ThirdwebProviderRN({
  children,
  createWalletStorage: createWalletStorageProp,
  supportedWallets,
  thirdwebApiKey = DEFAULT_API_KEY,
  ...props
}: ThirdwebProviderRNProps) {
  const [activeWalletMeta, setActiveWalletMeta] = useState<
    WalletMeta | undefined
  >();

  const supportedWalletsRN = useMemo(() => {
    if (!supportedWallets) {
      return [WalletConnect, DeviceBrowserWallet];
    }

    return supportedWallets.map((wallet) => {
      if (walletsMetadata[wallet].versions.includes("2")) {
        return WalletConnect;
      } else if (walletsMetadata[wallet].versions.includes("1")) {
        return WalletConnectV1;
      } else {
        switch (wallet) {
          case "deviceWallet":
            return DeviceBrowserWallet;
        }

        throw new Error("Unsupported wallet: " + wallet);
      }
    });
  }, [supportedWallets]);

  return (
    <WalletsProvider
      value={{
        supportedWallets: supportedWallets,
        activeWalletMeta,
        setActiveWalletMeta,
      }}
    >
      <ThirdwebProviderCore
        {...props}
        thirdwebApiKey={thirdwebApiKey}
        supportedWallets={supportedWalletsRN}
        createWalletStorage={createWalletStorageProp || createAsyncLocalStorage}
      >
        <ThirdwebContextProvider>{children}</ThirdwebContextProvider>
      </ThirdwebProviderCore>
    </WalletsProvider>
  );
}
