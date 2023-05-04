import { LocalWallet, WalletOptions } from "@thirdweb-dev/wallets";
import { LocalWalletConfig, LocalConfiguredWallet } from "./types";
import { LocalWalletConnectUI } from "./LocalWalletConnectUI";

export const localWallet = (config?: LocalWalletConfig) => {
  const configuredWallet = {
    id: LocalWallet.id,
    meta: { ...LocalWallet.meta, name: "Guest Wallet" },
    create: (options: WalletOptions) => new LocalWallet(options),
    config: {
      persist: config && config.persist !== undefined ? config.persist : true,
    },
    connectUI(props) {
      return <LocalWalletConnectUI {...props} localWallet={configuredWallet} />;
    },
    isInstalled() {
      // TODO
      return false;
    },
  } satisfies LocalConfiguredWallet;

  return configuredWallet;
};
