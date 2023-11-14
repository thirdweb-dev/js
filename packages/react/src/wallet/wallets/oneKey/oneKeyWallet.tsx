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
      iconURL:
        "data:image/png;base64,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",
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
