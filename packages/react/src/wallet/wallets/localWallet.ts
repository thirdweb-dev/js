import { Wallet } from "@thirdweb-dev/react-core";
import { LocalWallet, WalletOptions } from "@thirdweb-dev/wallets";

type LocalWalletConfig = {
  /**
   * If `true`, the encrypted wallet JSON will be stored on localStorage with user's password.
   * the user will not need to enter their password again when they visit the site. Beacuse of this, swallet can not be auto connected.
   *
   * If `false`, wallet will not be stored, and no password will be required to connect.
   * the wallet will be lost when the user leaves or reloads the page.
   *
   * @default true
   */
  persist?: boolean;
};

export type LocalWalletObj = Wallet<LocalWallet, Required<LocalWalletConfig>>;

export const localWallet = (config?: LocalWalletConfig) => {
  return {
    id: LocalWallet.id,
    meta: { ...LocalWallet.meta, name: "Guest Wallet" },
    create: (options: WalletOptions) => new LocalWallet(options),
    config: {
      persist: config && config.persist !== undefined ? config.persist : true,
    },
  } satisfies LocalWalletObj;
};
