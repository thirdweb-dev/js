import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import {
  SmartWallet,
  SmartWalletConfig as SmartWalletConfigWallets,
  createAsyncLocalStorage,
} from "@thirdweb-dev/wallets";
import { DEFAULT_WALLETS } from "../../constants/wallets";
import { createLocalStorage } from "../../../core/AsyncStorage";

type SmartWalletConfig = {
  personalWallets: WalletConfig[];
} & SmartWalletConfigWallets;

export type SmartWalletObj = WalletConfig<SmartWallet, SmartWalletConfig>;

export const smartWallet = (
  config: Omit<SmartWalletConfig, "personalWallets"> & {
    personalWallets?: WalletConfig[];
  },
): WalletConfig<SmartWallet, SmartWalletConfig> => {
  return {
    id: SmartWallet.id,
    meta: SmartWallet.meta,
    create: (options: WalletOptions) =>
      new SmartWallet({
        ...options,
        ...config,
        walletStorage: createAsyncLocalStorage("smart-wallet"),
        wcStorage: createLocalStorage("smart-wallet"),
      }),
    config: {
      ...config,
      personalWallets: config.personalWallets || DEFAULT_WALLETS,
    },
  };
};
