import { SafeWallet } from "@thirdweb-dev/wallets";
import type { Wallet, WalletOptions } from "@thirdweb-dev/react-core";
import { defaultWallets } from "./defaultWallets";

type SafeWalletConfig = {
  personalWallets?: Wallet[];
};

export type SafeWalletObj = Wallet<SafeWallet, Required<SafeWalletConfig>>;

export const safeWallet = (config?: SafeWalletConfig) => {
  return {
    id: SafeWallet.id,
    meta: SafeWallet.meta,
    create: (options: WalletOptions) => new SafeWallet({ ...options }),
    config: {
      personalWallets: config?.personalWallets || defaultWallets,
    },
  } satisfies SafeWalletObj;
};
