import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import {
  SmartWallet,
  SmartWalletConfig as SmartWalletConfigWallets,
} from "@thirdweb-dev/wallets";
import { DEFAULT_WALLETS } from "../../constants/wallets";

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
      new SmartWallet({ ...options, ...config }),
    config: {
      ...config,
      personalWallets: config.personalWallets || DEFAULT_WALLETS,
    },
  };
};
