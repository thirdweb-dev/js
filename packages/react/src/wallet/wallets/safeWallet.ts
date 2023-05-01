import { SafeWallet } from "@thirdweb-dev/wallets";
import type { Wallet, WalletOptions } from "@thirdweb-dev/react-core";

type SafeWalletConfig = {
  personalWallets?: Wallet[];
};

export type SafeWalletObj = Wallet & {
  config?: SafeWalletConfig;
};

export const safeWallet = (config?: SafeWalletConfig) => {
  return {
    id: SafeWallet.id,
    meta: SafeWallet.meta,
    create: (options: WalletOptions) => new SafeWallet({ ...options }),
    config,
  } satisfies SafeWalletObj;
};
