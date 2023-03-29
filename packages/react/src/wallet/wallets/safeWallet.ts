import { SafeWallet } from "@thirdweb-dev/wallets";
import type { Wallet, WalletOptions } from "@thirdweb-dev/react-core";

export const safeWallet = () => {
  return {
    id: SafeWallet.id,
    meta: SafeWallet.meta,
    create: (options: WalletOptions) => new SafeWallet({ ...options }),
  } satisfies Wallet;
};
