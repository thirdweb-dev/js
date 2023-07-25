import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import { BloctoWallet } from "@thirdweb-dev/wallets";

export type BloctoAdditionalOptions = {
  /**
   * Your app’s unique identifier that can be obtained at https://developers.blocto.app,
   * To get advanced features and support with Blocto.
   *
   * https://docs.blocto.app/blocto-sdk/register-app-id
   */
  appId?: string;
};

export const bloctoWallet = (
  options?: BloctoAdditionalOptions,
): WalletConfig<BloctoWallet> => ({
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
