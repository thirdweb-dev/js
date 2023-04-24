import type { Wallet } from "@thirdweb-dev/react-core";
import { LocalWallet, WalletOptions } from "@thirdweb-dev/wallets";

export const localWallet = () => {
  return {
    id: LocalWallet.id,
    meta: LocalWallet.meta,
    create: (options: WalletOptions) => new LocalWallet(options),
  } satisfies Wallet;
};
