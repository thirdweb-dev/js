import { LocalWallet, WalletOptions } from "@thirdweb-dev/wallets";
import { LocalWalletConfig, LocalConfiguredWallet } from "./types";
import { LocalWalletConnectUI } from "./LocalWalletConnectUI";

export const localWallet = (
  options?: LocalWalletConfig,
): LocalConfiguredWallet => {
  return {
    id: LocalWallet.id,
    meta: { ...LocalWallet.meta, name: "Guest Wallet" },
    create: (walletOptions: WalletOptions) => new LocalWallet(walletOptions),
    connectUI(props) {
      return (
        <LocalWalletConnectUI {...props} persist={options?.persist || true} />
      );
    },
    autoSwitch: true,
  };
};
