import type { Wallet, WalletOptions } from "@thirdweb-dev/react-core";
import { SmartWallet } from "@thirdweb-dev/wallets";

type SafeWalletConfig = {
  factoryAddress: string;
  thirdwebApiKey: string;
  gasless: boolean;
  personalWallets?: Wallet[];
};

export type SmartWalletObj = Wallet & {
  config: SafeWalletConfig;
};

export const smartWallet = (config: SafeWalletConfig) => {
  return {
    id: SmartWallet.id,
    meta: SmartWallet.meta,
    create: (options: WalletOptions) =>
      new SmartWallet({ ...options, ...config }),
    config,
  } satisfies SmartWalletObj;
};
