import { createAsyncLocalStorage } from "../../core/AsyncStorage";
import { DEFAULT_API_KEY } from "../constants/rpc";
import { CoinbaseWalletMobile } from "../wallets/wallets/coinbase-wallet-mobile";
import { MetamaskWallet } from "../wallets/wallets/wallets";
import {
  SupportedWallet,
  ThirdwebProvider as ThirdwebProviderCore,
  ThirdwebProviderProps as ThirdwebProviderCoreProps,
} from "@thirdweb-dev/react-core";
import React, { PropsWithChildren } from "react";

export type ThirdwebProviderProps = PropsWithChildren<
  {
    supportedWallets?: SupportedWallet[];
    createWalletStorage?: ThirdwebProviderCoreProps["createWalletStorage"];
  } & Omit<
    ThirdwebProviderCoreProps,
    "supportedWallets" | "createWalletStorage"
  >
>;

export function ThirdwebProvider({
  children,
  createWalletStorage,
  thirdwebApiKey = DEFAULT_API_KEY,
  supportedWallets = [MetamaskWallet, CoinbaseWalletMobile],
  ...props
}: ThirdwebProviderProps) {
  return (
    <ThirdwebProviderCore
      {...props}
      thirdwebApiKey={thirdwebApiKey}
      supportedWallets={supportedWallets}
      createWalletStorage={
        createWalletStorage ? createWalletStorage : createAsyncLocalStorage
      }
    >
      {children}
    </ThirdwebProviderCore>
  );
}
