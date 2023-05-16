import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import { SmartWallet } from "@thirdweb-dev/wallets";
import { DEFAULT_WALLETS } from "../../constants/wallets";

type SafeWalletConfig = {
  factoryAddress: string;
  thirdwebApiKey: string;
  gasless: boolean;
  personalWallets: WalletConfig[];
};

export type SmartWalletObj = WalletConfig<SmartWallet, SafeWalletConfig>;

export const smartWallet = (
  config: Omit<SafeWalletConfig, "personalWallets"> & {
    personalWallets?: WalletConfig[];
  },
) => {
  return {
    id: SmartWallet.id,
    meta: SmartWallet.meta,
    create: (options: WalletOptions) =>
      new SmartWallet({ ...options, ...config }),
    config: {
      ...config,
      personalWallets: config.personalWallets || DEFAULT_WALLETS,
    },
  } satisfies WalletConfig<SmartWallet, SafeWalletConfig>;
};
