import type { Wallet, WalletOptions } from "@thirdweb-dev/react-core";
import { SmartWallet } from "@thirdweb-dev/wallets";
import { DEFAULT_WALLETS } from "../../constants/wallets";

type SafeWalletConfig = {
  factoryAddress: string;
  thirdwebApiKey: string;
  gasless: boolean;
  personalWallets: Wallet[];
};

export type SmartWalletObj = Wallet & {
  config: SafeWalletConfig;
};

export const smartWallet = (
  config: Omit<SafeWalletConfig, "personalWallets"> & {
    personalWallets?: Wallet[];
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
  } satisfies SmartWalletObj;
};
