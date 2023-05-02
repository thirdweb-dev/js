import type { Wallet, WalletOptions } from "@thirdweb-dev/react-core";
import { SmartWallet } from "@thirdweb-dev/wallets";
import { defaultWallets } from "./defaultWallets";

type SafeWalletConfig = {
  factoryAddress: string;
  thirdwebApiKey: string;
  gasless: boolean;
  personalWallets?: Wallet[];
};

export type SmartWalletObj = Wallet<SmartWallet, Required<SafeWalletConfig>>;

export const smartWallet = (config: SafeWalletConfig) => {
  return {
    id: SmartWallet.id,
    meta: SmartWallet.meta,
    create: (options: WalletOptions) =>
      new SmartWallet({ ...options, ...config }),
    config: {
      ...config,
      personalWallets: config?.personalWallets || defaultWallets,
    },
  } satisfies SmartWalletObj;
};
