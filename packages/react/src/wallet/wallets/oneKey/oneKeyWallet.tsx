import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { OneKeyWallet, getInjectedOneKeyProvider } from "@thirdweb-dev/wallets";
import { OneKeyConnectUI } from "./OneKeyConnectUI";

type OneKeyOptions = {
  /**
   * When connecting OneKey wallet using the QR Code - Wallet Connect connector is used which requires a project id.
   * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#projectid-required
   */
  projectId?: string;

  /**
   * If true, the wallet will be tagged as "reccomended" in ConnectWallet Modal
   */
  recommended?: boolean;
};

export const oneKeyWallet = (
  options?: OneKeyOptions,
): WalletConfig<OneKeyWallet> => {
  return {
    id: OneKeyWallet.id,
    recommended: options?.recommended,
    meta: {
      name: "OneKey Wallet",
      urls: {
        chrome:
          "https://chrome.google.com/webstore/detail/onekey/jnmbobjmhlngoefaiojfljckilhhlhcj",
        android:
          "https://play.google.com/store/apps/details?id=so.onekey.app.wallet",
        ios: "https://apps.apple.com/us/app/onekey-blockchain-defi-wallet/id1609559473",
      },
      iconURL: "",
    },
    create: (walletOptions: WalletOptions) => {
      const wallet = new OneKeyWallet({
        ...walletOptions,
        projectId: options?.projectId,
        qrcode: false,
      });

      return wallet;
    },
    connectUI: OneKeyConnectUI,
    isInstalled() {
      return !!getInjectedOneKeyProvider();
    },
  };
};
