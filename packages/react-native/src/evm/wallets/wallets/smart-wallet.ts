import type { ConfiguredWallet, WalletOptions } from "@thirdweb-dev/react-core";
import {
  SmartWallet,
  SmartWalletConfig as SmartWalletConfigWallets,
} from "@thirdweb-dev/wallets";
import { DEFAULT_WALLETS } from "../../constants/wallets";

type SmartWalletConfig = {
  personalWallets: ConfiguredWallet[];
} & SmartWalletConfigWallets;

export type SmartWalletObj = ConfiguredWallet & {
  config: SmartWalletConfig;
};

export const smartWallet = (
  config: Omit<SmartWalletConfig, "personalWallets"> & {
    personalWallets?: ConfiguredWallet[];
  },
): ConfiguredWallet<SmartWallet, SmartWalletConfig> => {
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
