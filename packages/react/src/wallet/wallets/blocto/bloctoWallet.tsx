import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import { BloctoWallet, BloctoAdditionalOptions } from "@thirdweb-dev/wallets";

export const bloctoWallet = (options: BloctoAdditionalOptions): WalletConfig<BloctoWallet> => ({
  id: BloctoWallet.id,
  meta: BloctoWallet.meta,
  create(walletOptions: WalletOptions) {
    return new BloctoWallet({
      ...walletOptions,
      ...options,
    });
  },
  isInstalled() {
    return false;
  },
});
