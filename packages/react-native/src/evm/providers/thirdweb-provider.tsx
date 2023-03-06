import { createAsyncLocalStorage } from "../../core/AsyncStorage";
import { DEFAULT_API_KEY } from "../constants/rpc";
import { ThirdwebContextProvider } from "../contexts/thirdweb-context-provider";
import { WalletsProvider } from "../contexts/wallets-context";
import { WalletMeta } from "../types/wallet";
import { CoinbaseWalletMobile } from "../wallets/wallets/coinbase-wallet-mobile";
import { MetamaskWallet } from "../wallets/wallets/wallets";
import {
  SupportedWallet,
  ThirdwebProvider,
  ThirdwebProviderProps,
} from "@thirdweb-dev/react-core";
import React, { PropsWithChildren, useState } from "react";

export type ThirdwebProviderRNProps = PropsWithChildren<
  {
    supportedWallets?: SupportedWallet[];
    createWalletStorage?: ThirdwebProviderProps["createWalletStorage"];
  } & Omit<ThirdwebProviderProps, "supportedWallets" | "createWalletStorage">
>;

export function ThirdwebProviderRN({
  children,
  createWalletStorage,
  thirdwebApiKey = DEFAULT_API_KEY,
  supportedWallets = [MetamaskWallet, CoinbaseWalletMobile],
  ...props
}: ThirdwebProviderRNProps) {
  const [activeWalletMeta, setActiveWalletMeta] = useState<
    WalletMeta | undefined
  >();

  return (
    <WalletsProvider
      value={{
        supportedWallets: supportedWallets,
        activeWalletMeta,
        setActiveWalletMeta,
      }}
    >
      <ThirdwebProvider
        {...props}
        thirdwebApiKey={thirdwebApiKey}
        supportedWallets={supportedWallets}
        createWalletStorage={
          createWalletStorage ? createWalletStorage : createAsyncLocalStorage
        }
      >
        <ThirdwebContextProvider>{children}</ThirdwebContextProvider>
      </ThirdwebProvider>
    </WalletsProvider>
  );
}
